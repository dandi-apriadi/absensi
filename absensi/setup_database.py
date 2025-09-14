#!/usr/bin/env python3
"""
Database Setup Script for Face Recognition System
Run this script to create necessary database tables
"""

import os
import sys
from dotenv import load_dotenv
import mysql.connector
from mysql.connector import Error

# Load environment variables
load_dotenv()

def get_db_connection():
    """Get database connection"""
    try:
        connection = mysql.connector.connect(
            host=os.getenv('DB_HOST', 'localhost'),
            user=os.getenv('DB_USER', 'root'),
            password=os.getenv('DB_PASSWORD', ''),
            database=os.getenv('DB_NAME', 'elearning'),
            charset='utf8mb4',
            collation='utf8mb4_general_ci'
        )
        return connection
    except Error as e:
        print(f"Error connecting to database: {e}")
        return None

def execute_sql_file(connection, sql_file_path):
    """Execute SQL commands from file"""
    try:
        cursor = connection.cursor()
        
        with open(sql_file_path, 'r', encoding='utf-8') as file:
            sql_commands = file.read()
        
        # Split commands by semicolon and execute each
        commands = [cmd.strip() for cmd in sql_commands.split(';') if cmd.strip()]
        
        for command in commands:
            if command.strip().startswith('--') or not command.strip():
                continue
            
            try:
                cursor.execute(command)
                print(f"✅ Executed: {command[:50]}...")
            except Error as e:
                print(f"❌ Error executing command: {e}")
                print(f"Command: {command[:100]}...")
        
        connection.commit()
        cursor.close()
        return True
        
    except Exception as e:
        print(f"Error executing SQL file: {e}")
        return False

def create_admin_user(connection):
    """Create default admin user if not exists"""
    try:
        from argon2 import PasswordHasher
        
        cursor = connection.cursor()
        
        # Check if admin user exists
        cursor.execute("SELECT COUNT(*) FROM users WHERE email = 'admin@system.local'")
        count = cursor.fetchone()[0]
        
        if count == 0:
            # Create admin user
            ph = PasswordHasher()
            hashed_password = ph.hash('admin123')
            
            admin_data = {
                'user_id': 'ADMIN001',
                'email': 'admin@system.local',
                'password': hashed_password,
                'full_name': 'System Administrator',
                'role': 'super-admin',
                'status': 'active',
                'admin_level': 'system_admin',
                'department': 'IT'
            }
            
            query = """
            INSERT INTO users (user_id, email, password, full_name, role, status, admin_level, department)
            VALUES (%(user_id)s, %(email)s, %(password)s, %(full_name)s, %(role)s, %(status)s, %(admin_level)s, %(department)s)
            """
            
            cursor.execute(query, admin_data)
            connection.commit()
            
            print("✅ Default admin user created:")
            print("   Email: admin@system.local")
            print("   Password: admin123")
            print("   ⚠️  Please change the password after first login!")
        else:
            print("ℹ️  Admin user already exists")
        
        cursor.close()
        return True
        
    except Exception as e:
        print(f"Error creating admin user: {e}")
        return False

def main():
    """Main setup function"""
    print("🚀 Starting Face Recognition System Database Setup...")
    print("=" * 60)
    
    # Check if we're in the right directory
    if not os.path.exists('.env'):
        print("❌ .env file not found. Please run this script from the absensi directory.")
        sys.exit(1)
    
    # Get database connection
    print("📡 Connecting to database...")
    connection = get_db_connection()
    
    if not connection:
        print("❌ Failed to connect to database. Please check your .env configuration.")
        sys.exit(1)
    
    print(f"✅ Connected to database: {os.getenv('DB_NAME', 'elearning')}")
    
    # Execute schema file
    schema_file = os.path.join('..', 'face_recognition_schema.sql')
    if os.path.exists(schema_file):
        print("📋 Creating database tables...")
        if execute_sql_file(connection, schema_file):
            print("✅ Database tables created successfully")
        else:
            print("❌ Failed to create some database tables")
    else:
        print(f"⚠️  Schema file not found: {schema_file}")
    
    # Create admin user
    print("👤 Setting up admin user...")
    create_admin_user(connection)
    
    # Close connection
    connection.close()
    
    print("=" * 60)
    print("🎉 Setup completed!")
    print()
    print("Next steps:")
    print("1. Install Python dependencies: pip install -r requirements.txt")
    print("2. Run the application: python main.py")
    print("3. Login with admin@system.local / admin123")
    print("4. Change the admin password after first login")
    print()

if __name__ == "__main__":
    main()