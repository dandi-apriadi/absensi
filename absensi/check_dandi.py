import sys
import os

# Add the current directory to the path to import simple_database
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from simple_database import simple_db
from datetime import datetime

def check_dandi_data():
    print("=== CHECKING DANDI USER DATA ===")
    
    # Check if Dandi exists in users table
    users = simple_db.execute_query("SELECT user_id, fullname, role FROM users WHERE fullname LIKE '%dandi%' OR user_id LIKE '%dandi%'")
    print(f"\nDandi users found: {len(users) if users else 0}")
    if users:
        for user in users:
            if isinstance(user, dict):
                user_id = user['user_id']
                fullname = user['fullname']
                role = user['role']
            else:
                user_id = user[0]
                fullname = user[1]
                role = user[2]
                
            print(f"User_ID: {user_id}, Name: {fullname}, Role: {role}")
            
            # Check class enrollments
            enrollments = simple_db.execute_query("""
                SELECT se.class_id, cc.class_name, c.course_name
                FROM student_enrollments se
                JOIN course_classes cc ON se.class_id = cc.id
                JOIN courses c ON cc.course_id = c.id
                WHERE se.student_id = %s
            """, (user_id,))
            
            print(f"\nClass enrollments for {fullname}:")
            if enrollments:
                for enrollment in enrollments:
                    if isinstance(enrollment, dict):
                        print(f"  Class ID: {enrollment['class_id']}, Class: {enrollment['class_name']}, Course: {enrollment['course_name']}")
                    else:
                        print(f"  Class ID: {enrollment[0]}, Class: {enrollment[1]}, Course: {enrollment[2]}")
            else:
                print("  No class enrollments found!")
            
            # Check attendance sessions for today
            today = datetime.now().strftime('%Y-%m-%d')
            sessions = simple_db.execute_query("""
                SELECT 
                    ats.id as session_id,
                    ats.session_date,
                    ats.start_time,
                    ats.end_time,
                    ats.session_name,
                    cc.class_name,
                    c.course_name
                FROM attendance_sessions ats
                JOIN course_classes cc ON ats.class_id = cc.id
                JOIN courses c ON cc.course_id = c.id
                JOIN student_enrollments se ON cc.id = se.class_id
                WHERE se.student_id = %s 
                AND ats.session_date = %s
                AND ats.status = 'active'
                ORDER BY ats.start_time
            """, (user_id, today))
            
            print(f"\nToday's sessions ({today}) for {fullname}:")
            if sessions:
                for session in sessions:
                    if isinstance(session, dict):
                        print(f"  Session: {session['session_name']}, Time: {session['start_time']}-{session['end_time']}, Class: {session['class_name']}")
                    else:
                        print(f"  Session: {session[4]}, Time: {session[2]}-{session[3]}, Class: {session[5]}")
            else:
                print("  No sessions scheduled for today!")
    else:
        print("\nChecking all users to find anyone with 'dandi' in name:")
        all_users = simple_db.execute_query("SELECT user_id, fullname, role FROM users")
        if all_users:
            for user in all_users:
                if isinstance(user, dict):
                    print(f"  User_ID: {user['user_id']}, Name: {user['fullname']}, Role: {user['role']}")
                else:
                    print(f"  User_ID: {user[0]}, Name: {user[1]}, Role: {user[2]}")

if __name__ == "__main__":
    check_dandi_data()