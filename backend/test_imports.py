#!/usr/bin/env python3
"""Test script to debug import issues"""

print("Testing imports...")

try:
    print("1. Testing config import...")
    from config import settings
    print("✓ Config imported successfully")
    print(f"   OpenAI API key: {settings.openai_api_key[:10]}...")
    print(f"   Supabase URL: {settings.supabase_url}")
except Exception as e:
    print(f"✗ Config import failed: {e}")
    import traceback
    traceback.print_exc()

try:
    print("\n2. Testing models import...")
    from models.ai_coach import AICoachMessage
    print("✓ AI coach models imported successfully")
except Exception as e:
    print(f"✗ Models import failed: {e}")
    import traceback
    traceback.print_exc()

try:
    print("\n3. Testing services import...")
    from services.ai_coach_service import AICoachService
    print("✓ AI coach service imported successfully")
except Exception as e:
    print(f"✗ Services import failed: {e}")
    import traceback
    traceback.print_exc()

try:
    print("\n4. Testing routers import...")
    from routers.ai_coach import ai_coach_router
    print("✓ AI coach router imported successfully")
except Exception as e:
    print(f"✗ Routers import failed: {e}")
    import traceback
    traceback.print_exc()

print("\nAll tests completed!") 