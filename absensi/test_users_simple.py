"""
Simple test untuk check users data dengan fresh connection approach
"""

from simple_database import simple_db

def test_users_simple():
    print("="*50)
    print("TESTING USERS WITH SIMPLE DATABASE")
    print("="*50)
    
    # Test basic query
    print("\n--- TESTING BASIC QUERY ---")
    basic_query = "SELECT COUNT(*) as user_count FROM users"
    result = simple_db.execute_query(basic_query)
    
    if result:
        print(f"✅ Total users in database: {result[0]['user_count']}")
    else:
        print("❌ Failed to get user count")
        return
    
    # Get sample users
    print("\n--- GETTING SAMPLE USERS ---")
    users_query = "SELECT user_id, fullname, email, password, role, status FROM users LIMIT 5"
    users = simple_db.execute_query(users_query)
    
    if users:
        print(f"✅ Found {len(users)} users:")
        for i, user in enumerate(users, 1):
            print(f"\n{i}. User: {user['fullname']}")
            print(f"   Email: {user['email']}")
            print(f"   Password: '{user['password']}'")
            print(f"   Role: {user['role']}")
            print(f"   Status: {user['status']}")
    else:
        print("❌ No users found")
        return
    
    # Test specific email
    print("\n--- TESTING SPECIFIC EMAIL ---")
    test_email = users[0]['email']  # Use first user's email
    print(f"Testing with email: {test_email}")
    
    specific_query = "SELECT * FROM users WHERE email = %s AND status = 'active'"
    specific_result = simple_db.execute_query(specific_query, (test_email,))
    
    if specific_result:
        user = specific_result[0]
        print(f"✅ User found with email {test_email}:")
        print(f"   Name: {user['fullname']}")
        print(f"   Password: '{user['password']}'")
        print(f"   Status: {user['status']}")
        print(f"   Role: {user['role']}")
        
        print(f"\n🔑 LOGIN CREDENTIALS FOR TESTING:")
        print(f"   Email: {user['email']}")
        print(f"   Password: {user['password']}")
    else:
        print(f"❌ No active user found with email: {test_email}")

if __name__ == "__main__":
    test_users_simple()
