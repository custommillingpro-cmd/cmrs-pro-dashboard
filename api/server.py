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

def get_db_connection():
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
    # Dummy authentication for now
    if req.password != "12345":
        raise HTTPException(status_code=401, detail="Invalid Credentials")
    
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    # Check if miller exists
    cursor.execute("SELECT id, name FROM millers WHERE id = %s", (req.username,))
    miller = cursor.fetchone()
    
    conn.close()
    
    if not miller:
        raise HTTPException(status_code=401, detail="Miller ID not found")
        
    return {"status": "success", "miller": miller}

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
    
    conn.close()
    
    # Transform to match original data.js format
    formatted_data = {
        "miller_id": miller['id'],
        "miller_name_full": miller['name'],
        "rice_target": miller['target_rice'],
        "rice_deposited": miller['deposited_rice'],
        "rice_balance": miller['rice_balance'],
        "total_do": miller['total_allotted_paddy'],
        "balance_paddy": miller['balance_paddy'],
        "paddy_amt": miller['paddy_amt'],
        "balance_bg": miller['bg_amount'],
        "free_bg": miller['free_bg'],
        
        # We need to format rice_qualities back to list of dicts with 'qualities'
        # The original was: [{'agreement': '...', 'qualities': {'ARWA': 100}}]
        # Since we just saved quality_type and quantity, we can simplify or group them
        "rice_qualities": [{"qualities": {rq['quality_type']: rq['quantity']}} for rq in rice_qualities],
        
        "gatepasses": [
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
        "bgs": [
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
    trigger_github_action(miller_id, req.password, action_type="add-mill")
    
    return {"status": "success", "message": "Credentials saved. Data extraction started in background."}

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
        
    # Check 1-hour cooldown
    if cred['last_sync_time']:
        time_diff = datetime.now() - cred['last_sync_time']
        if time_diff < timedelta(hours=1):
            conn.close()
            remaining_mins = int(60 - time_diff.total_seconds() / 60)
            raise HTTPException(
                status_code=429, 
                detail=f"Sync is frozen to prevent server overload. Please try again in {remaining_mins} minutes."
            )
            
    # Update last_sync_time
    try:
        cursor.execute("UPDATE miller_credentials SET last_sync_time = NOW() WHERE miller_id = %s", (miller_id,))
        conn.commit()
    except Exception as e:
        conn.rollback()
    finally:
        conn.close()
        
    # Trigger background worker
    trigger_github_action(miller_id, cred['portal_password'], action_type="sync")
    
    return {"status": "success", "message": "Live sync started in background. Refresh dashboard in 1-2 minutes."}
