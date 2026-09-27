import os
import sys

# Set testing environment variables before any other imports
os.environ["SECRET_KEY"] = "test_secret_key_for_testing_only"
os.environ["ENVIRONMENT"] = "test"
os.environ["DATABASE_URL"] = "sqlite:///:memory:"

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
