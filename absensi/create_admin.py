from simple_database import simple_db
from argon2 import PasswordHasher
import uuid

# Create new admin user with known password
ph = PasswordHasher()

# Hash the password
password = "admin123"
hashed_password = ph.hash(password)

print(f"Password: {password}")
print(f"Hashed: {hashed_password}")

# Check if admin@system.local already exists
existing = simple_db.execute_query("SELECT COUNT(*) as count FROM users WHERE email = 'admin@system.local'")
if existing and existing[0]['count'] > 0:
    print("Admin user admin@system.local already exists")
    # Update the password
    result = simple_db.execute_query(
        "UPDATE users SET password = %s WHERE email = 'admin@system.local'",
        (hashed_password,)
    )
    if result:
        print("✅ Password updated for admin@system.local")
    else:
        print("❌ Failed to update password")
else:
    # Create new admin user
    user_data = (
        'ADMIN_SYSTEM',  # user_id
        'System Administrator',  # fullname
        'super-admin',  # role
        'male',  # gender
        'admin@system.local',  # email
        hashed_password,  # password
        'active',  # status
        'IT Department'  # address
    )
    
    result = simple_db.execute_query("""
        INSERT INTO users (user_id, fullname, role, gender, email, password, status, address)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    """, user_data)
    
    if result:
        print("✅ New admin user created successfully!")
        print("Email: admin@system.local")
        print("Password: admin123")
    else:
        print("❌ Failed to create admin user")

print("\nAll admin users:")
admins = simple_db.execute_query("SELECT user_id, fullname, email FROM users WHERE role = 'super-admin'")
for admin in admins:
    print(f"- {admin['email']} ({admin['fullname']})")