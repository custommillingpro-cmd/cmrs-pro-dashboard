from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import mysql.connector
import os
from pydantic import BaseModel
import requests
from datetime import datetime, timedelta
import json

app = FastAPI(title="CMRS PRO API")

# Allow requests from the live website
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict to cmrspro.com in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "ok", "message": "CMRS Pro API Backend is running"}

from mysql.connector import pooling

# Initialize TiDB Connection Pool
try:
    db_pool = pooling.MySQLConnectionPool(
        pool_name="cmrs_pool",
        pool_size=5,
        pool_reset_session=True,
        host=os.getenv("DB_HOST", "gateway01.ap-southeast-1.prod.alicloud.tidbcloud.com"),
        port=int(os.getenv("DB_PORT", 4000)),
        user=os.getenv("DB_USER", "47DktuAxv5uhMxU.root"),
        password=os.getenv("DB_PASSWORD", "IgkKsq49O0py7Cxs"),
        database=os.getenv("DB_NAME", "cmrs_pro"),
        ssl_verify_cert=False,
        ssl_verify_identity=False
    )
except Exception as pe:
    print(f"Error initializing database pool: {pe}")
    db_pool = None

def get_db_connection():
    if db_pool:
        try:
            return db_pool.get_connection()
        except Exception as e:
            print(f"Failed to get pooled connection, falling back to direct connection: {e}")
            
    try:
        return mysql.connector.connect(
            host=os.getenv("DB_HOST", "gateway01.ap-southeast-1.prod.alicloud.tidbcloud.com"),
            port=int(os.getenv("DB_PORT", 4000)),
            user=os.getenv("DB_USER", "47DktuAxv5uhMxU.root"),
            password=os.getenv("DB_PASSWORD", "IgkKsq49O0py7Cxs"),
            database=os.getenv("DB_NAME", "cmrs_pro"),
            ssl_verify_cert=False,
            ssl_verify_identity=False
        )
    except Exception as e:
        print(f"DB Error: {e}")
        raise HTTPException(status_code=500, detail="Database Connection Failed")

class LoginRequest(BaseModel):
    username: str
    password: str

@app.post("/api/login")
def login(req: LoginRequest):
    miller_id = req.username.upper().strip()
    
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    try:
        # Check if credentials exist
        cursor.execute("SELECT portal_password FROM miller_credentials WHERE miller_id = %s", (miller_id,))
        cred = cursor.fetchone()
        
        if cred:
            # Miller exists in credentials, check password
            if cred['portal_password'] != req.password:
                raise HTTPException(status_code=401, detail="Invalid Portal Password")
            
            # Password correct, check if data is available
            cursor.execute("SELECT id FROM millers WHERE id = %s", (miller_id,))
            if not cursor.fetchone():
                return {"status": "processing", "message": "First time login. Data extraction is still running in background. Please wait 1-2 minutes."}
            return {"status": "success", "message": "Login successful"}
            
        else:
            # First time logging in ever! We treat this as Add Mill
            cursor.execute('''
                INSERT INTO miller_credentials (miller_id, portal_password)
                VALUES (%s, %s)
            ''', (miller_id, req.password))
            conn.commit()
            
            # Trigger background worker
            trigger_github_action(miller_id, req.password, action_type="add-mill")
            return {"status": "processing", "message": "First time login. Data extraction started in background. Please wait 1-2 minutes and refresh."}
            
    except HTTPException:
        raise
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail="Database Error")
    finally:
        conn.close()

@app.get("/api/dashboard/{miller_id}")
def get_dashboard_data(miller_id: str):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    # Fetch Miller Details
    cursor.execute("SELECT * FROM millers WHERE id = %s", (miller_id,))
    miller = cursor.fetchone()
    
    if not miller:
        conn.close()
        raise HTTPException(status_code=404, detail="Miller not found")
        
    # Fetch Rice Qualities
    cursor.execute("SELECT * FROM rice_qualities WHERE miller_id = %s", (miller_id,))
    rice_qualities = cursor.fetchall()
    
    # Fetch Gatepasses
    cursor.execute("SELECT * FROM gatepasses WHERE miller_id = %s", (miller_id,))
    gatepasses = cursor.fetchall()
    
    # Fetch Pending DOs
    cursor.execute("SELECT * FROM pending_dos WHERE miller_id = %s", (miller_id,))
    pending_dos = cursor.fetchall()
    
    # Fetch Bank Guarantees
    cursor.execute("SELECT * FROM bank_guarantees WHERE miller_id = %s", (miller_id,))
    bgs = cursor.fetchall()
    
    # Fetch last sync time
    cursor.execute("SELECT last_sync_time FROM miller_credentials WHERE miller_id = %s", (miller_id,))
    cred = cursor.fetchone()
    last_sync = None
    if cred and cred.get('last_sync_time'):
        last_sync = cred['last_sync_time'].strftime("%Y-%m-%dT%H:%M:%SZ")
    
    conn.close()
    
    # Group rice qualities by agreement number
    rq_dict = {}
    for rq in rice_qualities:
        ano = rq.get('agreement_no') or ''
        atype = rq.get('agreement_type') or ''
        qtype = rq.get('quality_type') or ''
        qty = float(rq.get('quantity') or 0.0)
        
        if not ano:
            ano = 'Other'
            atype = 'Other'
            
        if ano not in rq_dict:
            rq_dict[ano] = {
                "agreement_no": ano,
                "agreement_type": atype,
                "total_pending": 0.0,
                "qualities": {}
            }
            
        if qtype in rq_dict[ano]["qualities"]:
            rq_dict[ano]["qualities"][qtype] += qty
        else:
            rq_dict[ano]["qualities"][qtype] = qty
        rq_dict[ano]["total_pending"] += qty
        
    formatted_rq = list(rq_dict.values())
    
    # Transform to match original data.js format
    formatted_data = {
        "miller_id": miller['id'],
        "name": miller['name'],
        "miller_name_full": miller['name'],
        "last_sync_time": last_sync,
        "metrics": {
            "riceTarget": miller['target_rice'],
            "riceDeposited": miller['deposited_rice'],
            "riceBalance": miller['rice_balance'],
            "totalAllottedPaddy": miller['total_allotted_paddy'],
            "balancePaddy": miller['balance_paddy'],
            "paddyAmt": miller['paddy_amt'],
            "bgAmount": miller['bg_amount'],
            "freeBg": miller['free_bg']
        },
        
        "riceQualities": formatted_rq,
        
        "gatePassStatus": [
            {
                "lotNo": gp['lot_no'],
                "date": gp['pass_date'],
                "quantity": gp['quantity'],
                "status": gp['status'],
                "agreement": gp['agreement_no'],
                "cmrCenter": gp['cmr_center'],
                "commodity": gp['commodity'],
                "bagYear": gp['bag_year'],
                "approvalDate": gp['approval_date']
            } for gp in gatepasses
        ],
        "pendingDOs": [
            {
                "agreement": do['agreement_no'],
                "center": do['center'],
                "date": do['do_date'],
                "type": do['paddy_type'],
                "qty": do['quantity']
            } for do in pending_dos
        ],
        "nearestBgs": [
            {
                "id": bg['bg_no'],
                "bank": bg['bank_name'],
                "amount": bg['amount'],
                "date": bg['valid_date'],
                "daysLeft": bg['days_left']
            } for bg in bgs
        ]
    }
    
    return {
        "status": "success",
        "data": formatted_data
    }
    
@app.get("/api/health")
def health_check():
    return {"status": "ok"}

# --- PHASE 3 AUTOMATION ENDPOINTS ---

class AddMillRequest(BaseModel):
    miller_id: str
    password: str

def trigger_github_action(miller_id: str, password: str, action_type: str = "sync"):
    """Trigger GitHub Actions workflow via repository_dispatch"""
    github_token = os.getenv("GITHUB_TOKEN")
    repo = os.getenv("GITHUB_REPO", "custommillingpro-cmd/cmrs-pro-dashboard")
    
    if not github_token:
        print("Warning: GITHUB_TOKEN not set, skipping real automation trigger.")
        return False
        
    url = f"https://api.github.com/repos/{repo}/dispatches"
    headers = {
        "Accept": "application/vnd.github.v3+json",
        "Authorization": f"token {github_token}"
    }
    payload = {
        "event_type": f"trigger-{action_type}",
        "client_payload": {
            "miller_id": miller_id,
            "password": password
        }
    }
    
    try:
        response = requests.post(url, headers=headers, json=payload, timeout=10)
        return response.status_code == 204
    except Exception as e:
        print(f"Failed to trigger GitHub Action: {e}")
        return False

@app.post("/api/add-mill")
def add_mill(req: AddMillRequest):
    miller_id = req.miller_id.upper().strip()
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Save or update credentials
        cursor.execute('''
            INSERT INTO miller_credentials (miller_id, portal_password)
            VALUES (%s, %s)
            ON DUPLICATE KEY UPDATE portal_password = %s
        ''', (miller_id, req.password, req.password))
        conn.commit()
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail="Database error")
    finally:
        conn.close()
        
    # Trigger the background scraper to fetch data for the first time
    triggered = trigger_github_action(miller_id, req.password, action_type="add-mill")
    
    msg = "Credentials saved. Data extraction started in background."
    if not triggered:
        msg = "Credentials saved. (Background sync not configured, will sync on next manual run)"
    
    return {"status": "success", "message": msg}

class SyncRequest(BaseModel):
    miller_id: str

@app.post("/api/sync-live")
def sync_live(req: SyncRequest):
    miller_id = req.miller_id.upper().strip()
    
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    cursor.execute("SELECT * FROM miller_credentials WHERE miller_id = %s", (miller_id,))
    cred = cursor.fetchone()
    
    if not cred:
        conn.close()
        raise HTTPException(status_code=404, detail="Credentials not found. Please re-add mill.")
        
    # Freeze check removed as per user request
    # Removed preemptive last_sync_time update so frontend polling waits for actual scraper completion.
    conn.close()
        
    # Trigger background worker
    triggered = trigger_github_action(miller_id, cred['portal_password'], action_type="sync")
    
    msg = "Live sync started in background. The dashboard will update automatically in 1-2 minutes."
    if not triggered:
        msg = "Sync request registered. (Background sync not configured, please run scraper manually)"
    
    return {"status": "success", "message": msg}
