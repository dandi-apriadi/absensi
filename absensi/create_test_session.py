from simple_database import simple_db
from datetime import datetime, timedelta

def create_test_session():
    print("=== CREATING TEST ATTENDANCE SESSION ===")
    
    # Create attendance session for today for Dandi's class (class_id = 15)
    today = datetime.now().strftime('%Y-%m-%d')
    start_time = "09:00:00"
    end_time = "11:00:00"
    
    # Insert attendance session
    query = """
    INSERT INTO attendance_sessions 
    (class_id, session_number, session_date, start_time, end_time, 
     topic, session_type, attendance_method, status, created_by, created_at, updated_at)
    VALUES 
    (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    
    values = (
        15,  # class_id for Dandi's class
        1,   # session_number
        today,  # session_date
        start_time,
        end_time,
        "Face Recognition Test Session",  # topic
        "regular",  # session_type
        "face_recognition",  # attendance_method
        "scheduled",  # status
        "admin001",  # created_by
        datetime.now(),  # created_at
        datetime.now()   # updated_at
    )
    
    try:
        result = simple_db.execute_query(query, values)
        if result:
            print(f"✅ Test session created successfully for {today}")
            print(f"   Class: 15 (Analisis Sistem)")
            print(f"   Time: {start_time} - {end_time}")
            print(f"   Topic: Face Recognition Test Session")
        else:
            print("❌ Failed to create test session")
    except Exception as e:
        print(f"❌ Error creating test session: {e}")

if __name__ == "__main__":
    create_test_session()