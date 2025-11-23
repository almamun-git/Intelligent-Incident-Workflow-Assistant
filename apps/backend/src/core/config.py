"""
Configuration management using Pydantic Settings.
Reads environment variables from .env file.
"""
from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # Database
    database_url: str = "sqlite:///./test.db"
    
    # OpenAI
    openai_api_key: str = ""
    
    # Application
    environment: str = "development"
    log_level: str = "INFO"
    
    # Incident Detection Settings
    incident_threshold: int = 5  # Number of errors to trigger incident
    incident_time_window: int = 300  # 5 minutes in seconds
    
    class Config:
        env_file = ".env"


@lru_cache()
def get_settings() -> Settings:
    """
    Get cached settings instance.
    Using lru_cache ensures we only read .env once.
    """
    return Settings()
