import os
import sys

# Ensure project root is on sys.path so we can import from `src.backend_py`
CURRENT_DIR = os.path.dirname(__file__)
PROJECT_ROOT = os.path.abspath(os.path.join(CURRENT_DIR, ".."))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

# Export the FastAPI ASGI app for Vercel
from src.backend_py.server import app as app
