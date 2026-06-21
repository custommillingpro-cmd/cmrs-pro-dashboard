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
    
    return {
        "status": "success",
        "data": {
            "miller": miller,
            "rice_qualities": rice_qualities,
            "gatepasses": gatepasses,
            "pending_dos": pending_dos,
            "bank_guarantees": bgs
        }
    }
    
@app.get("/api/health")
def health_check():
    return {"status": "ok"}
