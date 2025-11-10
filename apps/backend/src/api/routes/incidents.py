from fastapi import APIRouter, HTTPException
from typing import List
from ..models.incident import Incident
from ..services.ai_service import classify_incident
from sqlalchemy.orm import Session
from ..dependencies import get_db

router = APIRouter()

@router.post("/incidents/", response_model=Incident)
def create_incident(incident: Incident, db: Session = Depends(get_db)):
    db.add(incident)
    db.commit()
    db.refresh(incident)
    return incident

@router.get("/incidents/", response_model=List[Incident])
def get_incidents(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    incidents = db.query(Incident).offset(skip).limit(limit).all()
    return incidents

@router.get("/incidents/{incident_id}", response_model=Incident)
def get_incident(incident_id: int, db: Session = Depends(get_db)):
    incident = db.query(Incident).filter(Incident.id == incident_id).first()
    if incident is None:
        raise HTTPException(status_code=404, detail="Incident not found")
    return incident

@router.put("/incidents/{incident_id}", response_model=Incident)
def update_incident(incident_id: int, incident: Incident, db: Session = Depends(get_db)):
    db_incident = db.query(Incident).filter(Incident.id == incident_id).first()
    if db_incident is None:
        raise HTTPException(status_code=404, detail="Incident not found")
    
    for key, value in incident.dict().items():
        setattr(db_incident, key, value)
    
    db.commit()
    db.refresh(db_incident)
    return db_incident

@router.post("/incidents/classify/")
def classify_incident_endpoint(incident_data: dict, db: Session = Depends(get_db)):
    classification = classify_incident(incident_data)
    return {"classification": classification}