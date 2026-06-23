-- CMRS PRO MySQL Database Schema
-- Run this file in your MySQL database to create the necessary tables.

CREATE DATABASE IF NOT EXISTS cmrs_pro;
USE cmrs_pro;

-- 1. Millers Table (Main Profile & Aggregate Data)
CREATE TABLE IF NOT EXISTS millers (
    id VARCHAR(50) PRIMARY KEY, -- Miller ID e.g., 'MA446578'
    name VARCHAR(255) NOT NULL,
    target_rice DECIMAL(15, 3) DEFAULT 0.000,
    deposited_rice DECIMAL(15, 3) DEFAULT 0.000,
    rice_balance DECIMAL(15, 3) DEFAULT 0.000,
    total_allotted_paddy DECIMAL(15, 3) DEFAULT 0.000,
    balance_paddy DECIMAL(15, 3) DEFAULT 0.000,
    paddy_amt DECIMAL(15, 2) DEFAULT 0.00,
    bg_amount DECIMAL(15, 2) DEFAULT 0.00,
    free_bg DECIMAL(15, 2) DEFAULT 0.00,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Rice Qualities Breakdown
CREATE TABLE IF NOT EXISTS rice_qualities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    miller_id VARCHAR(50) NOT NULL,
    agreement_no VARCHAR(100),
    agreement_type VARCHAR(100),
    quality_type VARCHAR(100) NOT NULL, -- e.g., 'Mota', 'Sarna', 'Patla'
    quantity DECIMAL(15, 3) NOT NULL,
    FOREIGN KEY (miller_id) REFERENCES millers(id) ON DELETE CASCADE
);

-- 3. Gatepasses Table (CMR Lots)
CREATE TABLE IF NOT EXISTS gatepasses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    miller_id VARCHAR(50) NOT NULL,
    lot_no VARCHAR(100),
    pass_date VARCHAR(50),
    quantity DECIMAL(15, 3),
    status VARCHAR(50), -- 'Approved' or 'Pending'
    agreement_no VARCHAR(100),
    cmr_center VARCHAR(255),
    commodity VARCHAR(100),
    bag_year VARCHAR(50),
    approval_date VARCHAR(50),
    FOREIGN KEY (miller_id) REFERENCES millers(id) ON DELETE CASCADE
);

-- 4. Pending Delivery Orders (DOs)
CREATE TABLE IF NOT EXISTS pending_dos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    miller_id VARCHAR(50) NOT NULL,
    agreement_no VARCHAR(100),
    center VARCHAR(255),
    do_date VARCHAR(50),
    paddy_type VARCHAR(50), 
    quantity DECIMAL(15, 3),
    FOREIGN KEY (miller_id) REFERENCES millers(id) ON DELETE CASCADE
);

-- 5. Bank Guarantees (BGs)
CREATE TABLE IF NOT EXISTS bank_guarantees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    miller_id VARCHAR(50) NOT NULL,
    bank_name VARCHAR(255),
    bg_no VARCHAR(100),
    amount DECIMAL(15, 2),
    issue_date VARCHAR(50),
    valid_date VARCHAR(50),
    claim_date VARCHAR(50),
    days_left INT,
    FOREIGN KEY (miller_id) REFERENCES millers(id) ON DELETE CASCADE
);

-- 6. Miller Credentials & Last Sync Track
CREATE TABLE IF NOT EXISTS miller_credentials (
    miller_id VARCHAR(50) PRIMARY KEY,
    portal_password VARCHAR(255) NOT NULL,
    last_sync_time TIMESTAMP NULL DEFAULT NULL
);
