from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import audit, bias, simulate, ai, upload

app = FastAPI(title="Intelligent Data Guardian API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(audit.router, prefix="/api/audit", tags=["Audit"])
app.include_router(bias.router, prefix="/api/bias", tags=["Bias"])
app.include_router(simulate.router, prefix="/api/simulate", tags=["Simulate"])
app.include_router(ai.router, prefix="/api/ai", tags=["AI Governance"])
app.include_router(upload.router, prefix="/api/upload", tags=["Upload"])

@app.get("/")
def read_root():
    return {"message": "Welcome to Intelligent Data Guardian API"}

if __name__ == "__main__":
    import uvicorn
    import os
    # Fetch the dynamic port provided by Render (or default to 8000 locally)
    port = int(os.environ.get("PORT", 8000))
    # Start the server listening on 0.0.0.0 directly
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)
