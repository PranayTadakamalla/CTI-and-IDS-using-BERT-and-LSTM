"""
Configuration management for CTI-IDS backend
"""

import os
from enum import Enum

class LogLevel(str, Enum):
    DEBUG = "DEBUG"
    INFO = "INFO"
    WARNING = "WARNING"
    ERROR = "ERROR"

class Config:
    """Application configuration"""
    
    # API Configuration
    API_TITLE = "CTI-IDS API"
    API_VERSION = "1.0.0"
    API_HOST = os.getenv("API_HOST", "0.0.0.0")
    API_PORT = int(os.getenv("API_PORT", 8000))
    
    # Logging
    LOG_LEVEL = LogLevel(os.getenv("LOG_LEVEL", "INFO"))
    
    # Model Configuration
    MODEL_PATH = os.getenv("MODEL_PATH", "./models/")
    BERT_MODEL = "bert-base-uncased"
    LSTM_HIDDEN_UNITS = 64
    CNN_INPUT_SHAPE = (224, 224, 3)
    
    # Cache Configuration
    CACHE_SIZE = int(os.getenv("CACHE_SIZE", 1000))
    CACHE_TTL = 3600  # 1 hour
    
    # Alert Thresholds
    IDS_ALERT_THRESHOLD = 0.75
    CRITICAL_THREAT_THRESHOLD = 0.75
    HIGH_THREAT_THRESHOLD = 0.6
    MEDIUM_THREAT_THRESHOLD = 0.4
    
    # API Endpoints
    VIRUSTOTAL_API_TIMEOUT = 10
    URLHAUS_API_TIMEOUT = 10
    SHODAN_API_TIMEOUT = 10
    
    # Database (optional)
    DATABASE_URL = os.getenv(
        "DATABASE_URL",
        "postgresql://threat_admin:secure_password@localhost:5432/cti_ids"
    )
    
    @classmethod
    def get_config(cls):
        """Get current configuration"""
        return {
            "api_title": cls.API_TITLE,
            "api_version": cls.API_VERSION,
            "log_level": cls.LOG_LEVEL.value,
            "model_path": cls.MODEL_PATH,
            "cache_size": cls.CACHE_SIZE,
        }

config = Config()
