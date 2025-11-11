"""
Incident model - represents a group of related events.
"""
from sqlalchemy import Column, String, DateTime, Integer, Text, JSON, Enum as SQLEnum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from ..core.database import Base


class IncidentStatus(str, enum.Enum):
    """Status of an incident."""
    OPEN = "open"
    INVESTIGATING = "investigating"
    RESOLVED = "resolved"
    CLOSED = "closed"


class Incident(Base):
    """
    Represents a group of related events (an incident).
    
    Attributes:
        id: Unique identifier
        service: Name of the affected service
        category: AI-classified category (e.g., "database_issue", "memory_leak")
        severity: Priority level (P1=Critical, P2=High, P3=Medium)
        summary: AI-generated human-readable summary
        recommended_actions: List of suggested fix actions (JSON array)
        status: Current status of the incident
        created_at: When the incident was created
        updated_at: Last update timestamp
    """
    __tablename__ = "incidents"
    
    id = Column(Integer, primary_key=True, index=True)
    service = Column(String(100), nullable=False, index=True)
    category = Column(String(50), nullable=True)  # AI-classified
    severity = Column(String(10), nullable=True)  # P1, P2, P3
    summary = Column(Text, nullable=True)  # AI-generated
    recommended_actions = Column(JSON, nullable=True)  # List of action keys
    status = Column(SQLEnum(IncidentStatus), default=IncidentStatus.OPEN, index=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationship to events
    events = relationship("Event", back_populates="incident")
    
    def __repr__(self):
        return f"<Incident {self.id} - {self.service} - {self.status}>"