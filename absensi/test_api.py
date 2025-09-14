import requests
import json
from datetime import datetime

# Test the new endpoint without auth
try:
    test_data = {
        'user_id': 12,  # Assuming Dandi's ID is 12
        'date': datetime.now().strftime('%Y-%m-%d')
    }
    response = requests.post('http://localhost:5000/api/attendance/check-access', 
                           json=test_data, timeout=10)
    print(f'Check-access endpoint: {response.status_code}')
    print(f'Response: {response.text}')
    
    if response.status_code == 200:
        data = response.json()
        print(f'Success: {data.get("success")}')
        print(f'Data: {data.get("data")}')
except Exception as e:
    print(f'Check-access endpoint failed: {e}')