from fastapi import APIRouter, HTTPException
from typing import List, Dict

router = APIRouter()

@router.get("/analytics", response_model=List[Dict])
async def get_analytics():
    # Placeholder for analytics data retrieval logic
    analytics_data = [
        {"incident_id": 1, "count": 5},
        {"incident_id": 2, "count": 3},
    ]
    return analytics_data

@router.get("/analytics/{incident_id}", response_model=Dict)
async def get_analytics_by_incident(incident_id: int):
    # Placeholder for specific incident analytics retrieval logic
    if incident_id not in [1, 2]:
        raise HTTPException(status_code=404, detail="Incident not found")
    
    analytics_data = {"incident_id": incident_id, "count": 5}
    return analytics_data