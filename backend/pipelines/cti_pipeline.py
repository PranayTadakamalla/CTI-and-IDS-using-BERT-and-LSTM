"""
Enhanced Cyber Threat Intelligence (CTI) Pipeline
Real-time processing with actual API integrations
"""

import logging
from typing import Dict, List, Any
from datetime import datetime
import os
from dotenv import load_dotenv

from integrations.threat_intel_apis import (
    VirusTotalAPI, AbuseIPDBAPI, OTXAPIIntegration, ShodanAPI, ThreatIntelAggregator
)

load_dotenv()

logger = logging.getLogger(__name__)


class CTIPipeline:
    """Enhanced CTI data ingestion with real API sources"""
    
    def __init__(self):
        self.vt = VirusTotalAPI()
        self.abuseipdb = AbuseIPDBAPI()
        self.otx = OTXAPIIntegration()
        self.shodan = ShodanAPI()
        self.aggregator = ThreatIntelAggregator()
        
        self.sources = {
            'virustotal': 'VirusTotal API',
            'abuseipdb': 'AbuseIPDB API',
            'otx': 'OTX API',
            'shodan': 'Shodan API',
        }
        self.cache = {}
        logger.info("Initialized Enhanced CTI Pipeline with real API integrations")
    
    def fetch_threat_data(self, indicator: str) -> Dict[str, Any]:
        """Fetch threat intelligence from real APIs for an indicator"""
        
        logger.info(f"Fetching real CTI data for indicator: {indicator}")
        
        # Check cache first
        if indicator in self.cache:
            logger.info(f"Using cached CTI data for: {indicator}")
            return self.cache[indicator]
        
        threat_data = self.aggregator.analyze_indicator(indicator)
        
        risk_level = "Unknown"
        if threat_data.get('aggregated_risk_score', 0) > 0.8:
            risk_level = "Critical"
        elif threat_data.get('aggregated_risk_score', 0) > 0.6:
            risk_level = "High"
        elif threat_data.get('aggregated_risk_score', 0) > 0.4:
            risk_level = "Medium"
        else:
            risk_level = "Low"
        
        threat_data['risk_level'] = risk_level
        threat_data['last_updated'] = datetime.now().isoformat()
        
        # Cache the result
        self.cache[indicator] = threat_data
        
        return threat_data
    
    def process_batch(self, indicators: List[str]) -> List[Dict[str, Any]]:
        """Process multiple indicators in batch"""
        logger.info(f"Processing batch of {len(indicators)} indicators with real APIs")
        
        results = []
        for indicator in indicators:
            result = self.fetch_threat_data(indicator)
            results.append(result)
        
        return results
    
    def get_cached_data(self, indicator: str) -> Dict[str, Any]:
        """Retrieve cached threat data if available"""
        return self.cache.get(indicator, None)
