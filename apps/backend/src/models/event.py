"""
Event model - represents a single log/error event from an application.
"""
from sqlalchemy import Column, String, DateTime, ForeignKey, Integer, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from ..core.database import Base


class Event(Base):
    """
    Represents a single log/error event.
    
    Attributes:
        id: Unique identifier
        service: Name of the service (e.g., "auth-api", "payment-service")
        level: Log level (ERROR, WARN, INFO)
        message: The actual error/log message
        timestamp: When the event occurred
        incident_id: Foreign key to incident (if grouped)
    """
    __tablename__ = "events"
    
    id = Column(Integer, primary_key=True, index=True)
    service = Column(String(100), nullable=False, index=True)
    level = Column(String(20), nullable=False)  # ERROR, WARN, INFO
    message = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    incident_id = Column(Integer, ForeignKey("incidents.id"), nullable=True)
    
    # Relationship to incident
    incident = relationship("Incident", back_populates="events")
    
    def __repr__(self):
        return f"<Event {self.id} - {self.service} - {self.level}>"
