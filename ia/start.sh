#!/bin/bash
cd /home/orientatec/ia
set -a
source .env
set +a
source venv/bin/activate
exec venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000
