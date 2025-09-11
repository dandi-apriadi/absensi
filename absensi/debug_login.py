"""
Debug script untuk melihat data users di database
"""

from database import db

def check_users_data():
    print("="*50)
    print("CHECKING USERS DATA")
    print("="*50)
    
    try:
        # Connect to database
        print("Connecting to database...")
        if not db.connect():
            print("❌ Failed to connect to database")
            return
            
        print("✅ Database connected successfully")
        
        # Check users table structure
        print("\n--- USERS TABLE STRUCTURE ---")
        structure_query = "DESCRIBE users"
        structure = db.execute_query(structure_query)
        
        if structure:
            for column in structure:
                print(f"Column: {column['Field']} | Type: {column['Type']} | Null: {column['Null']} | Default: {column['Default']}")
        
        # Get all users
        print("\n--- ALL USERS DATA ---")
        users_query = "SELECT user_id, fullname, email, password, role, status FROM users LIMIT 10"
        users = db.execute_query(users_query)
        
        if users:
            print(f"Found {len(users)} users:")
            for i, user in enumerate(users, 1):
                print(f"\n{i}. User ID: {user['user_id']}")
                print(f"   Name: {user['fullname']}")
                print(f"   Email: {user['email']}")
                print(f"   Password: {user['password']}")
                print(f"   Role: {user['role']}")
                print(f"   Status: {user['status']}")
        else:
            print("❌ No users found or query failed")
            
        # Check active users specifically
        print("\n--- ACTIVE USERS ONLY ---")
        active_query = "SELECT user_id, fullname, email, password, role FROM users WHERE status = 'active' LIMIT 5"
        active_users = db.execute_query(active_query)
        
        if active_users:
            print(f"Found {len(active_users)} active users:")
            for i, user in enumerate(active_users, 1):
                print(f"\n{i}. {user['fullname']} ({user['email']})")
                print(f"   Password: '{user['password']}'")
                print(f"   Role: {user['role']}")
        else:
            print("❌ No active users found")
            
        # Test specific email
        print("\n--- TESTING SPECIFIC EMAIL ---")
        test_email = input("Enter email to test (or press Enter to skip): ").strip()
        
        if test_email:
            test_query = "SELECT * FROM users WHERE email = %s"
            test_result = db.execute_query(test_query, (test_email,))
            
            if test_result:
                user = test_result[0]
                print(f"✅ User found:")
                print(f"   Email: {user['email']}")
                print(f"   Password: '{user['password']}'")
                print(f"   Status: {user['status']}")
                print(f"   Role: {user['role']}")
            else:
                print(f"❌ No user found with email: {test_email}")
        
    except Exception as e:
        print(f"❌ Error: {type(e).__name__}: {e}")
    
    finally:
        db.disconnect()

def suggest_test_credentials():
    print("\n" + "="*50)
    print("SUGGESTED TEST CREDENTIALS")
    print("="*50)
    
    try:
        if not db.connect():
            print("❌ Cannot connect to database")
            return
            
        # Get first active user
        query = "SELECT email, password FROM users WHERE status = 'active' LIMIT 1"
        result = db.execute_query(query)
        
        if result:
            user = result[0]
            print("✅ You can test login with:")
            print(f"   Email: {user['email']}")
            print(f"   Password: {user['password']}")
        else:
            print("❌ No active users found")
            
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        db.disconnect()

if __name__ == "__main__":
    check_users_data()
    suggest_test_credentials()
