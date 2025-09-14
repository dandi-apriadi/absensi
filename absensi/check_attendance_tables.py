#!/usr/bin/env python3
"""Check attendance table structures"""

from simple_database import SimpleDatabaseConnection

def check_attendance_tables():
    """Check structure of attendance tables"""
    db = SimpleDatabaseConnection()
    
    # Check attendance table structure
    print('=== ATTENDANCE TABLE ===')
    try:
        result = db.execute_query('DESCRIBE attendance')
        if result:
            for row in result:
                print(f'{row["Field"]}: {row["Type"]}')
        else:
            print('Table attendance does not exist')
    except Exception as e:
        print(f'Error checking attendance: {e}')
    
    print('\n=== STUDENT_ATTENDANCES TABLE ===')
    try:
        result = db.execute_query('DESCRIBE student_attendances')
        if result:
            for row in result:
                print(f'{row["Field"]}: {row["Type"]}')
        else:
            print('Table student_attendances does not exist')
    except Exception as e:
        print(f'Error checking student_attendances: {e}')

    # Check for any existing attendance records
    print('\n=== CHECKING FOR ATTENDANCE RECORDS ===')
    try:
        result = db.execute_query('SELECT COUNT(*) as count FROM attendance')
        if result:
            print(f'attendance table has {result[0]["count"]} records')
    except Exception as e:
        print(f'Error counting attendance: {e}')
        
    try:
        result = db.execute_query('SELECT COUNT(*) as count FROM student_attendances')
        if result:
            print(f'student_attendances table has {result[0]["count"]} records')
    except Exception as e:
        print(f'Error counting student_attendances: {e}')

if __name__ == "__main__":
    check_attendance_tables()