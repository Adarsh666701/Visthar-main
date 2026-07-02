#!/usr/bin/env python3
"""
Backend API Test Suite for VISTHAR Electronics
Tests all API endpoints at /api/*
"""

import requests
import json
import sys
from pymongo import MongoClient
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv('/app/.env')

BASE_URL = os.getenv('NEXT_PUBLIC_BASE_URL', 'https://visthar-future.preview.emergentagent.com')
API_URL = f"{BASE_URL}/api"
MONGO_URL = os.getenv('MONGO_URL', 'mongodb://localhost:27017')
DB_NAME = os.getenv('DB_NAME', 'visthar')

print(f"Testing API at: {API_URL}")
print(f"MongoDB: {MONGO_URL}, DB: {DB_NAME}")
print("=" * 80)

# MongoDB connection
try:
    mongo_client = MongoClient(MONGO_URL)
    db = mongo_client[DB_NAME]
    print("✅ MongoDB connection established")
except Exception as e:
    print(f"❌ MongoDB connection failed: {e}")
    sys.exit(1)

test_results = {
    'passed': 0,
    'failed': 0,
    'tests': []
}

def test_endpoint(name, method, path, payload=None, expected_status=200, check_fields=None, check_db=None):
    """Generic test function for API endpoints"""
    url = f"{API_URL}/{path}" if path else API_URL
    try:
        if method == 'GET':
            response = requests.get(url, timeout=10)
        elif method == 'POST':
            response = requests.post(url, json=payload, timeout=10)
        else:
            raise ValueError(f"Unsupported method: {method}")
        
        # Check status code
        if response.status_code != expected_status:
            print(f"❌ {name}: Expected status {expected_status}, got {response.status_code}")
            print(f"   Response: {response.text}")
            test_results['failed'] += 1
            test_results['tests'].append({'name': name, 'status': 'FAILED', 'reason': f"Status {response.status_code} != {expected_status}"})
            return False
        
        # Check CORS headers
        if 'Access-Control-Allow-Origin' not in response.headers:
            print(f"⚠️  {name}: Missing CORS header 'Access-Control-Allow-Origin'")
        
        # Check response fields
        if check_fields and response.status_code == 200:
            try:
                data = response.json()
                for field in check_fields:
                    if field not in data:
                        print(f"❌ {name}: Missing field '{field}' in response")
                        test_results['failed'] += 1
                        test_results['tests'].append({'name': name, 'status': 'FAILED', 'reason': f"Missing field '{field}'"})
                        return False
            except json.JSONDecodeError:
                print(f"❌ {name}: Invalid JSON response")
                test_results['failed'] += 1
                test_results['tests'].append({'name': name, 'status': 'FAILED', 'reason': 'Invalid JSON'})
                return False
        
        # Check database insertion
        if check_db and response.status_code == 200:
            collection_name, query_field, query_value = check_db
            try:
                doc = db[collection_name].find_one({query_field: query_value})
                if not doc:
                    print(f"❌ {name}: Document not found in {collection_name} collection")
                    test_results['failed'] += 1
                    test_results['tests'].append({'name': name, 'status': 'FAILED', 'reason': f"Doc not in {collection_name}"})
                    return False
                
                # Check if UUID is used (not ObjectID)
                if 'id' not in doc:
                    print(f"❌ {name}: Document missing 'id' field (UUID)")
                    test_results['failed'] += 1
                    test_results['tests'].append({'name': name, 'status': 'FAILED', 'reason': 'Missing UUID id field'})
                    return False
                
                # Verify it's a UUID format (basic check)
                if not isinstance(doc['id'], str) or len(doc['id']) != 36:
                    print(f"❌ {name}: 'id' field is not a valid UUID format")
                    test_results['failed'] += 1
                    test_results['tests'].append({'name': name, 'status': 'FAILED', 'reason': 'Invalid UUID format'})
                    return False
                    
            except Exception as e:
                print(f"❌ {name}: Database check failed: {e}")
                test_results['failed'] += 1
                test_results['tests'].append({'name': name, 'status': 'FAILED', 'reason': f"DB check error: {e}"})
                return False
        
        print(f"✅ {name}")
        test_results['passed'] += 1
        test_results['tests'].append({'name': name, 'status': 'PASSED'})
        return True
        
    except requests.exceptions.RequestException as e:
        print(f"❌ {name}: Request failed: {e}")
        test_results['failed'] += 1
        test_results['tests'].append({'name': name, 'status': 'FAILED', 'reason': f"Request error: {e}"})
        return False
    except Exception as e:
        print(f"❌ {name}: Unexpected error: {e}")
        test_results['failed'] += 1
        test_results['tests'].append({'name': name, 'status': 'FAILED', 'reason': f"Error: {e}"})
        return False

# Clean up test data before running tests
print("\n🧹 Cleaning up test data...")
test_email = "test-visthar-api@example.com"
test_company = "Test Company VISTHAR"
try:
    db['prebookings'].delete_many({'email': test_email})
    db['notify_me'].delete_many({'email': test_email})
    db['newsletter'].delete_many({'email': test_email})
    db['contact_messages'].delete_many({'email': test_email})
    db['oem_leads'].delete_many({'email': test_email})
    print("✅ Test data cleaned up")
except Exception as e:
    print(f"⚠️  Cleanup warning: {e}")

print("\n" + "=" * 80)
print("STARTING API TESTS")
print("=" * 80)

# Test 1: GET /api - Service status
print("\n1. Testing GET /api (Service Status)")
test_endpoint(
    "GET /api - Service status",
    "GET",
    "",
    check_fields=['ok', 'service', 'ts']
)

# Test 2: POST /api/prebook - Valid payload
print("\n2. Testing POST /api/prebook (Valid)")
test_endpoint(
    "POST /api/prebook - Valid payload",
    "POST",
    "prebook",
    payload={
        'email': test_email,
        'productSlug': 'visthar-ai-hub',
        'name': 'John Doe',
        'phone': '+1234567890'
    },
    check_fields=['ok', 'id', 'message'],
    check_db=('prebookings', 'email', test_email)
)

# Test 3: POST /api/prebook - Missing email
print("\n3. Testing POST /api/prebook (Missing email)")
test_endpoint(
    "POST /api/prebook - Missing email",
    "POST",
    "prebook",
    payload={'productSlug': 'visthar-ai-hub'},
    expected_status=400
)

# Test 4: POST /api/prebook - Missing productSlug
print("\n4. Testing POST /api/prebook (Missing productSlug)")
test_endpoint(
    "POST /api/prebook - Missing productSlug",
    "POST",
    "prebook",
    payload={'email': test_email},
    expected_status=400
)

# Test 5: POST /api/notify-me - Valid payload
print("\n5. Testing POST /api/notify-me (Valid)")
test_endpoint(
    "POST /api/notify-me - Valid payload",
    "POST",
    "notify-me",
    payload={
        'email': test_email,
        'productSlug': 'visthar-quantum-core'
    },
    check_fields=['ok', 'message'],
    check_db=('notify_me', 'email', test_email)
)

# Test 6: POST /api/notify-me - Missing email
print("\n6. Testing POST /api/notify-me (Missing email)")
test_endpoint(
    "POST /api/notify-me - Missing email",
    "POST",
    "notify-me",
    payload={'productSlug': 'visthar-quantum-core'},
    expected_status=400
)

# Test 7: POST /api/newsletter - Valid payload
print("\n7. Testing POST /api/newsletter (Valid)")
test_endpoint(
    "POST /api/newsletter - Valid payload",
    "POST",
    "newsletter",
    payload={'email': test_email},
    check_fields=['ok'],
    check_db=('newsletter', 'email', test_email)
)

# Test 8: POST /api/newsletter - Missing email
print("\n8. Testing POST /api/newsletter (Missing email)")
test_endpoint(
    "POST /api/newsletter - Missing email",
    "POST",
    "newsletter",
    payload={},
    expected_status=400
)

# Test 9: POST /api/contact - Valid payload
print("\n9. Testing POST /api/contact (Valid)")
test_endpoint(
    "POST /api/contact - Valid payload",
    "POST",
    "contact",
    payload={
        'email': test_email,
        'message': 'Test message for VISTHAR support',
        'name': 'Jane Smith',
        'subject': 'Product Inquiry'
    },
    check_fields=['ok', 'message'],
    check_db=('contact_messages', 'email', test_email)
)

# Test 10: POST /api/contact - Missing email
print("\n10. Testing POST /api/contact (Missing email)")
test_endpoint(
    "POST /api/contact - Missing email",
    "POST",
    "contact",
    payload={'message': 'Test message'},
    expected_status=400
)

# Test 11: POST /api/contact - Missing message
print("\n11. Testing POST /api/contact (Missing message)")
test_endpoint(
    "POST /api/contact - Missing message",
    "POST",
    "contact",
    payload={'email': test_email},
    expected_status=400
)

# Test 12: POST /api/oem-inquiry - Valid payload
print("\n12. Testing POST /api/oem-inquiry (Valid)")
test_endpoint(
    "POST /api/oem-inquiry - Valid payload",
    "POST",
    "oem-inquiry",
    payload={
        'email': test_email,
        'company': test_company,
        'name': 'Bob Johnson',
        'phone': '+1987654321',
        'volume': '10000 units',
        'message': 'Interested in bulk orders'
    },
    check_fields=['ok', 'message'],
    check_db=('oem_leads', 'email', test_email)
)

# Test 13: POST /api/oem-inquiry - Missing email
print("\n13. Testing POST /api/oem-inquiry (Missing email)")
test_endpoint(
    "POST /api/oem-inquiry - Missing email",
    "POST",
    "oem-inquiry",
    payload={'company': test_company},
    expected_status=400
)

# Test 14: POST /api/oem-inquiry - Missing company
print("\n14. Testing POST /api/oem-inquiry (Missing company)")
test_endpoint(
    "POST /api/oem-inquiry - Missing company",
    "POST",
    "oem-inquiry",
    payload={'email': test_email},
    expected_status=400
)

# Test 15: GET /api/stats - Returns counts
print("\n15. Testing GET /api/stats (Returns counts)")
test_endpoint(
    "GET /api/stats - Returns counts",
    "GET",
    "stats",
    check_fields=['prebookings', 'notify', 'newsletter', 'contact', 'oem']
)

# Test 16: Unknown route - 404
print("\n16. Testing unknown route (404)")
test_endpoint(
    "GET /api/unknown - 404 response",
    "GET",
    "unknown-route-test",
    expected_status=404
)

# Clean up test data after tests
print("\n🧹 Cleaning up test data after tests...")
try:
    db['prebookings'].delete_many({'email': test_email})
    db['notify_me'].delete_many({'email': test_email})
    db['newsletter'].delete_many({'email': test_email})
    db['contact_messages'].delete_many({'email': test_email})
    db['oem_leads'].delete_many({'email': test_email})
    print("✅ Test data cleaned up")
except Exception as e:
    print(f"⚠️  Cleanup warning: {e}")

# Print summary
print("\n" + "=" * 80)
print("TEST SUMMARY")
print("=" * 80)
print(f"Total Tests: {test_results['passed'] + test_results['failed']}")
print(f"✅ Passed: {test_results['passed']}")
print(f"❌ Failed: {test_results['failed']}")
print("=" * 80)

if test_results['failed'] > 0:
    print("\nFailed Tests:")
    for test in test_results['tests']:
        if test['status'] == 'FAILED':
            print(f"  - {test['name']}: {test.get('reason', 'Unknown')}")
    sys.exit(1)
else:
    print("\n🎉 All tests passed!")
    sys.exit(0)
