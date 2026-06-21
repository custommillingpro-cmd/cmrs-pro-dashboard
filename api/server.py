from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import mysql.connector
import os
from pydantic import BaseModel

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
