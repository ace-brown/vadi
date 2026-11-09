# Vadi AI service

Python service for Vadi's AI features (FastAPI). Express calls it under `/api/ai/*`; see `ai-roadmap.md` for the plan.

## Setup

Needs [uv](https://docs.astral.sh/uv/). From `ai-service/`:

```bash
uv sync                 # create .venv and install all dependencies, including dev tools
```

In VS Code, select `ai-service/.venv/bin/python` as the interpreter ("Python: Select Interpreter" → "Enter interpreter path...").

## Run

```bash
uv run uvicorn ai_service.main:app --reload   # http://localhost:8000, API docs at /docs
```

## Checks

```bash
uv run ruff check       # lint
uv run pytest           # tests
```
