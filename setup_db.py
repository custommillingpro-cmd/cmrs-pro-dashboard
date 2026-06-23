import mysql.connector

try:
    conn = mysql.connector.connect(
        host="gateway01.ap-southeast-1.prod.alicloud.tidbcloud.com",
        port=4000,
        user="47DktuAxv5uhMxU.root",
        password="IgkKsq49O0py7Cxs",
        database="cmrs_pro",
        ssl_verify_cert=False,
        ssl_verify_identity=False
    )
    cursor = conn.cursor()
    
    # Millers Table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS millers (
            id VARCHAR(50) PRIMARY KEY,
            name VARCHAR(255),
            target_rice FLOAT,
            deposited_rice FLOAT,
            rice_balance FLOAT,
            total_allotted_paddy FLOAT,
            balance_paddy FLOAT,
            paddy_amt FLOAT,
            bg_amount FLOAT,
            free_bg FLOAT
        )
    """)
    
    # Rice Qualities
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS rice_qualities (
            id INT AUTO_INCREMENT PRIMARY KEY,
            miller_id VARCHAR(50),
            agreement_no VARCHAR(100),
            agreement_type VARCHAR(100),
            quality_type VARCHAR(100),
            quantity FLOAT,
            FOREIGN KEY (miller_id) REFERENCES millers(id) ON DELETE CASCADE
        )
    """)
    
    # Gatepasses
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS gatepasses (
            id INT AUTO_INCREMENT PRIMARY KEY,
            miller_id VARCHAR(50),
            lot_no VARCHAR(100),
            pass_date VARCHAR(50),
            quantity FLOAT,
            status VARCHAR(100),
            agreement_no VARCHAR(100),
            cmr_center VARCHAR(255),
            commodity VARCHAR(100),
            bag_year VARCHAR(50),
            approval_date VARCHAR(50),
            FOREIGN KEY (miller_id) REFERENCES millers(id) ON DELETE CASCADE
        )
    """)
    
    # Pending DOs
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS pending_dos (
            id INT AUTO_INCREMENT PRIMARY KEY,
            miller_id VARCHAR(50),
            agreement_no VARCHAR(100),
            center VARCHAR(255),
            do_date VARCHAR(50),
            paddy_type VARCHAR(100),
            quantity FLOAT,
            FOREIGN KEY (miller_id) REFERENCES millers(id) ON DELETE CASCADE
        )
    """)
    
    # Bank Guarantees
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS bank_guarantees (
            id INT AUTO_INCREMENT PRIMARY KEY,
            miller_id VARCHAR(50),
            bank_name VARCHAR(255),
            bg_no VARCHAR(100),
            amount FLOAT,
            valid_date VARCHAR(50),
            days_left INT,
            FOREIGN KEY (miller_id) REFERENCES millers(id) ON DELETE CASCADE
        )
    """)
    
    # Miller Credentials
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS miller_credentials (
            miller_id VARCHAR(50) PRIMARY KEY,
            portal_password VARCHAR(255) NOT NULL,
            last_sync_time TIMESTAMP NULL DEFAULT NULL
        )
    """)
    
    conn.commit()
    print("SUCCESS: All tables created in TiDB!")
    conn.close()
except Exception as e:
    print(f"FAILED: {e}")
