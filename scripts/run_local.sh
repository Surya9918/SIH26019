#!/usr/bin/env bash
set -e

echo "=== Launching SIH26019 National Digital Platform for Land Governance ==="

# Set environment
export PYTHONPATH=.
export APP_ENV=development
export DEBUG=true

# Initialize & Seed Database if missing
if [ ! -f "data/land_governance.db" ]; then
    echo "[*] Initializing and seeding database..."
    python3 database/seeds/seed_data.py
fi

# Run Tests
echo "[*] Running verification tests..."
python3 -m unittest discover -s tests -p "test_*.py"

# Start FastAPI server
echo "[*] Starting server on http://0.0.0.0:8000 ..."
exec uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
