from simple_database import simple_db

# Check attendance_sessions table structure
result = simple_db.execute_query('DESCRIBE attendance_sessions')
print('Attendance_sessions table structure:')
for row in result:
    if isinstance(row, dict):
        print(f'  Column: {row["Field"]} - {row["Type"]}')
    else:
        print(f'  Column: {row}')

# Check if there are any sessions for class_id 15
sessions = simple_db.execute_query('SELECT * FROM attendance_sessions WHERE class_id = 15')
print(f'\nSessions for class_id 15: {len(sessions) if sessions else 0}')
if sessions:
    for session in sessions:
        print(f'  Session: {session}')

# Check if there are any sessions today
from datetime import datetime
today = datetime.now().strftime('%Y-%m-%d')
all_sessions_today = simple_db.execute_query('SELECT * FROM attendance_sessions WHERE session_date = %s', (today,))
print(f'\nAll sessions today ({today}): {len(all_sessions_today) if all_sessions_today else 0}')
if all_sessions_today:
    for session in all_sessions_today:
        print(f'  Session: {session}')