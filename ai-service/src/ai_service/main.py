import asyncio
from fastapi import FastAPI
from fastapi.responses import StreamingResponse

app = FastAPI()


async def generate_chunks():
    for i in range(240):
        yield f"Chunk {i}\n"
        await asyncio.sleep(1)


@app.get("/stream")
def test():
    return StreamingResponse(generate_chunks(), media_type="text/plain")
