#!/usr/bin/env python3
"""Script to create face_training table"""

from simple_database import SimpleDatabaseConnection

def create_face_training_table():
    """Create the face_training table"""
    db = SimpleDatabaseConnection()
    
    create_table_sql = """
    CREATE TABLE IF NOT EXISTS face_training (
        id int(11) NOT NULL AUTO_INCREMENT,
        employee_id varchar(20) NOT NULL,
        model_id varchar(36) NOT NULL,
        training_images_count int(11) NOT NULL DEFAULT 0,
        model_path varchar(255) NOT NULL,
        model_data longblob,
        training_date datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        accuracy_score decimal(5,4) DEFAULT NULL,
        status enum('active','inactive','training','failed') NOT NULL DEFAULT 'active',
        notes text,
        created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY unique_employee_model (employee_id),
        KEY idx_status (status),
        KEY idx_training_date (training_date)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
    """
    
    try:
        result = db.execute_query(create_table_sql)
        print("✓ face_training table created successfully")
        return True
    except Exception as e:
        print(f"✗ Error creating table: {e}")
        return False

if __name__ == "__main__":
    create_face_training_table()