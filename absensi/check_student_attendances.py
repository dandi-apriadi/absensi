#!/usr/bin/env python3
"""Check student_attendances table structure"""

from simple_database import SimpleDatabaseConnection

def check_student_attendances():
    """Check structure of student_attendances table"""
    db = SimpleDatabaseConnection()
    
    print('=== STUDENT_ATTENDANCES TABLE STRUCTURE ===')
    try:
        result = db.execute_query('DESCRIBE student_attendances')
        if result:
            for row in result:
                print(f'{row["Field"]}: {row["Type"]} - {row.get("Null", "")} - {row.get("Key", "")} - {row.get("Default", "")}')
        else:
            print('No columns found')
    except Exception as e:
        print(f'Error: {e}')
    
    print('\n=== SAMPLE DATA ===')
    try:
        result = db.execute_query('SELECT * FROM student_attendances LIMIT 5')
        if result:
            for row in result:
                print(row)
        else:
            print('No data found')
    except Exception as e:
        print(f'Error: {e}')

if __name__ == "__main__":
    check_student_attendances()