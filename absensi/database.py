import mysql.connector
from mysql.connector import Error
import os
from dotenv import load_dotenv

load_dotenv()

class DatabaseConnection:
    def __init__(self):
        self.host = os.getenv('DB_HOST', 'localhost')
        self.user = os.getenv('DB_USER', 'root')
        self.password = os.getenv('DB_PASSWORD', '')
        self.database = os.getenv('DB_NAME', 'insightflow')
        self.connection = None
        
    def connect(self):
        try:
            self.connection = mysql.connector.connect(
                host=self.host,
                user=self.user,
                password=self.password,
                database=self.database,
                charset='utf8mb4',
                collation='utf8mb4_general_ci'
            )
            if self.connection.is_connected():
                print("Successfully connected to MySQL database")
                return True
        except Error as e:
            print(f"Error while connecting to MySQL: {e}")
            return False
        
    def disconnect(self):
        if self.connection and self.connection.is_connected():
            self.connection.close()
            print("MySQL connection is closed")
            
    def execute_query(self, query, params=None):
        print(f"[DB DEBUG] Executing query: {query}")
        print(f"[DB DEBUG] With parameters: {params}")
        cursor = None
        try:
            if not self.connection or not self.connection.is_connected():
                print("[DB DEBUG] Connection not available, reconnecting...")
                self.connect()
                
            cursor = self.connection.cursor(dictionary=True)
            if params:
                cursor.execute(query, params)
            else:
                cursor.execute(query)
                
            if query.strip().upper().startswith('SELECT'):
                result = cursor.fetchall()
                print(f"[DB DEBUG] Query returned {len(result)} rows")
                print(f"[DB DEBUG] Result: {result}")
                return result
            else:
                self.connection.commit()
                print("[DB DEBUG] Query executed and committed")
                return True
                
        except Error as e:
            print(f"[DB DEBUG] Error executing query: {type(e).__name__}: {e}")
            print(f"[DB DEBUG] Full error details: {str(e)}")
            return None
        finally:
            if cursor:
                cursor.close()
                print("[DB DEBUG] Cursor closed")
            
    def create_face_training_table(self):
        """Create face_training table if it doesn't exist"""
        create_table_query = """
        CREATE TABLE IF NOT EXISTS face_training (
            training_id INT AUTO_INCREMENT PRIMARY KEY,
            employee_id INT NOT NULL,
            face_encoding LONGBLOB NOT NULL,
            image_path VARCHAR(255) NOT NULL,
            confidence_score DECIMAL(5,3) DEFAULT NULL,
            training_date DATETIME DEFAULT CURRENT_TIMESTAMP,
            is_active BOOLEAN DEFAULT TRUE,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (employee_id) REFERENCES employees(employee_id) ON DELETE CASCADE,
            INDEX idx_employee_id (employee_id),
            INDEX idx_active (is_active)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
        """
        return self.execute_query(create_table_query)
    
    def create_face_attendance_log_table(self):
        """Create face_attendance_log table for logging face recognition attempts"""
        create_table_query = """
        CREATE TABLE IF NOT EXISTS face_attendance_log (
            log_id INT AUTO_INCREMENT PRIMARY KEY,
            employee_id INT DEFAULT NULL,
            image_path VARCHAR(255) NOT NULL,
            recognition_confidence DECIMAL(5,3) DEFAULT NULL,
            recognition_status ENUM('success', 'failed', 'unknown_face') NOT NULL,
            attempt_time DATETIME DEFAULT CURRENT_TIMESTAMP,
            ip_address VARCHAR(45) DEFAULT NULL,
            device_info VARCHAR(255) DEFAULT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (employee_id) REFERENCES employees(employee_id) ON DELETE SET NULL,
            INDEX idx_employee_id (employee_id),
            INDEX idx_attempt_time (attempt_time),
            INDEX idx_status (recognition_status)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
        """
        return self.execute_query(create_table_query)

# Singleton instance
db = DatabaseConnection()
