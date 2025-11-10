from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Incident(Base):
    __tablename__ = 'incidents'

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String)
    status = Column(String, default='open')
    actions = relationship("IncidentAction", back_populates="incident")

class Action(Base):
    __tablename__ = 'actions'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    incidents = relationship("IncidentAction", back_populates="action")

class IncidentAction(Base):
    __tablename__ = 'incident_actions'

    id = Column(Integer, primary_key=True, index=True)
    incident_id = Column(Integer, ForeignKey('incidents.id'))
    action_id = Column(Integer, ForeignKey('actions.id'))

    incident = relationship("Incident", back_populates="actions")
    action = relationship("Action", back_populates="incidents")

class Event(Base):
    __tablename__ = 'events'

    id = Column(Integer, primary_key=True, index=True)
    incident_id = Column(Integer, ForeignKey('incidents.id'))
    timestamp = Column(String)
    details = Column(String)

    incident = relationship("Incident")