from simple_database import simple_db

# Check admin users
result = simple_db.execute_query("SELECT user_id, fullname, role, email, password FROM users WHERE role = 'super-admin' LIMIT 3")

print("Admin users in database:")
for user in result:
    print(f"Email: {user['email']}")
    print(f"Name: {user['fullname']}")
    print(f"Role: {user['role']}")
    print(f"Password hash: {user['password'][:50]}...")
    print("---")