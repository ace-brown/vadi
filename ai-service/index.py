# Vercel entrypoint. The app itself lives in src/ai_service/main.py.
#
# Vercel looks for an `app` object in files like index.py, app.py or main.py
# in the project root (or directly inside src/). It doesn't understand the
# src/ package layout, so `tool.vercel.entrypoint = "ai_service.main:app"`
# fails with PYTHON_ENTRYPOINT_NOT_FOUND. This file only re-exports the app
# so Vercel's automatic detection finds it.
#
# It imports through `src.` on purpose: that works from the project folder
# even if Vercel doesn't install the ai_service package itself. Locally, keep
# using `uv run uvicorn ai_service.main:app --reload`.
#
# vercel.json sets maxDuration for this file, keyed as "index.py".
from src.ai_service.main import app

__all__ = ["app"]
