import sys
import os

# Add the current directory to the path to import simple_database
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from backend_api import backend_api
from datetime import datetime

def test_access_verification():
    print("=== TESTING ACCESS VERIFICATION ===")
    
    user_id = "student001"  # Dandi's user_id
    today = datetime.now().strftime('%Y-%m-%d')
    
    print(f"Testing access for user: {user_id} on date: {today}")
    
    # Test the access verification
    result = backend_api.check_user_room_access(user_id, today)
    
    print(f"Result: {result}")
    
    if result:
        if result.get('allowed'):
            print("✅ ACCESS GRANTED!")
            sessions = result.get('sessions', [])
            print(f"Sessions found: {len(sessions)}")
            for session in sessions:
                print(f"  - {session}")
        else:
            print("❌ ACCESS DENIED")
            print(f"Reason: {result.get('reason')}")
    else:
        print("❌ ERROR - No result returned")

if __name__ == "__main__":
    test_access_verification()