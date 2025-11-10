from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from apps.backend.src.api.routes import incidents, analytics
from apps.backend.src.config import settings

app = FastAPI()

# Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(incidents.router, prefix="/incidents", tags=["incidents"])
app.include_router(analytics.router, prefix="/analytics", tags=["analytics"])

@app.get("/")
def read_root():
    return {"message": "Welcome to Ops-Assist AI - Intelligent Incident Management Platform"}