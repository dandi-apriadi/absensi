import mysql.connector
from mysql.connector import Error
import os
from dotenv import load_dotenv

load_dotenv()

class SimpleDatabaseConnection:
    def __init__(self):
        self.host = os.getenv('DB_HOST', 'localhost')
        self.user = os.getenv('DB_USER', 'root')
        self.password = os.getenv('DB_PASSWORD', '')
        self.database = os.getenv('DB_NAME', 'elearning')
        
    def execute_query(self, query, params=None):
        """Execute query with fresh connection each time"""
        connection = None
        cursor = None
        result = None
        
        print(f"[DB SIMPLE] Executing query: {query}")
        print(f"[DB SIMPLE] With parameters: {params}")
        
        try:
            # Create fresh connection
            connection = mysql.connector.connect(
                host=self.host,
                user=self.user,
                password=self.password,
                database=self.database,
                charset='utf8mb4',
                collation='utf8mb4_general_ci',
                autocommit=False
            )
            
            if not connection.is_connected():
                print("[DB SIMPLE] Failed to connect")
                return None
                
            print("[DB SIMPLE] Connected successfully")
            
            cursor = connection.cursor(dictionary=True, buffered=True)
            
            if params:
                cursor.execute(query, params)
            else:
                cursor.execute(query)
                
            if query.strip().upper().startswith(('SELECT', 'SHOW', 'DESCRIBE')):
                result = cursor.fetchall()
                print(f"[DB SIMPLE] Query returned {len(result) if result else 0} rows")
            else:
                connection.commit()
                print("[DB SIMPLE] Query executed and committed")
                result = True
                
            return result
                
        except Error as e:
            print(f"[DB SIMPLE] MySQL Error: {type(e).__name__}: {e}")
            if connection:
                try:
                    connection.rollback()
                except:
                    pass
            return None
        except Exception as e:
            print(f"[DB SIMPLE] General Error: {type(e).__name__}: {e}")
            return None
        finally:
            if cursor:
                try:
                    cursor.close()
                    print("[DB SIMPLE] Cursor closed")
                except:
                    pass
            if connection and connection.is_connected():
                try:
                    connection.close()
                    print("[DB SIMPLE] Connection closed")
                except:
                    pass

# Create simple instance
simple_db = SimpleDatabaseConnection()
