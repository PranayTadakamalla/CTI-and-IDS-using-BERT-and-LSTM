"""
Real Threat Intelligence API Integrations
Connects to VirusTotal, AbuseIPDB, OTX, and Shodan
"""

import os
import logging
from typing import Dict, Any, Optional
import requests
from datetime import datetime

logger = logging.getLogger(__name__)


class VirusTotalAPI:
    """VirusTotal threat intelligence integration"""
    
    def __init__(self):
        self.api_key = os.getenv('VIRUSTOTAL_API_KEY')
        self.base_url = "https://www.virustotal.com/api/v3"
        self.headers = {"x-apikey": self.api_key}
        if self.api_key:
            logger.info("VirusTotal API initialized")
        else:
            logger.warning("VirusTotal API key not configured")
    
    def check_hash(self, file_hash: str) -> Dict[str, Any]:
        """Check file hash against VirusTotal database"""
        if not self.api_key:
            return {'status': 'error', 'message': 'API key not configured'}
        
        try:
            url = f"{self.base_url}/files/{file_hash}"
            response = requests.get(url, headers=self.headers, timeout=10)
            response.raise_for_status()
            
            data = response.json()
            attrs = data.get('data', {}).get('attributes', {})
            
            return {
                'status': 'success',
                'hash': file_hash,
                'last_analysis_stats': attrs.get('last_analysis_stats'),
                'malware_families': attrs.get('tags', []),
                'last_analysis_date': attrs.get('last_analysis_date'),
                'confidence': 0.95,
            }
        except Exception as e:
            logger.error(f"VirusTotal check failed: {str(e)}")
            return {'status': 'error', 'message': str(e)}
    
    def check_url(self, url: str) -> Dict[str, Any]:
        """Check URL against VirusTotal database"""
        if not self.api_key:
            return {'status': 'error', 'message': 'API key not configured'}
        
        try:
            endpoint = f"{self.base_url}/urls"
            data = {"url": url}
            response = requests.post(endpoint, headers=self.headers, data=data, timeout=10)
            response.raise_for_status()
            
            result = response.json()
            return {
                'status': 'success',
                'url': url,
                'detection_stats': result.get('data', {}).get('attributes', {}).get('last_analysis_stats'),
                'last_analysis_date': result.get('data', {}).get('attributes', {}).get('last_analysis_date'),
                'confidence': 0.93,
            }
        except Exception as e:
            logger.error(f"VirusTotal URL check failed: {str(e)}")
            return {'status': 'error', 'message': str(e)}


class AbuseIPDBAPI:
    """AbuseIPDB threat intelligence integration"""
    
    def __init__(self):
        self.api_key = os.getenv('ABUSEIPDB_API_KEY')
        self.base_url = "https://api.abuseipdb.com/api/v2"
        if self.api_key:
            logger.info("AbuseIPDB API initialized")
        else:
            logger.warning("AbuseIPDB API key not configured")
    
    def check_ip(self, ip_address: str) -> Dict[str, Any]:
        """Check IP reputation against AbuseIPDB"""
        if not self.api_key:
            return {'status': 'error', 'message': 'API key not configured'}
        
        try:
            headers = {
                'Key': self.api_key,
                'Accept': 'application/json'
            }
            params = {
                'ipAddress': ip_address,
                'maxAgeInDays': 90,
                'verbose': True
            }
            
            response = requests.get(
                f"{self.base_url}/check",
                headers=headers,
                params=params,
                timeout=10
            )
            response.raise_for_status()
            
            data = response.json()['data']
            return {
                'status': 'success',
                'ip': ip_address,
                'abuseConfidenceScore': data.get('abuseConfidenceScore'),
                'totalReports': data.get('totalReports'),
                'lastReportedAt': data.get('lastReportedAt'),
                'usageType': data.get('usageType'),
                'confidence': 0.92,
            }
        except Exception as e:
            logger.error(f"AbuseIPDB check failed: {str(e)}")
            return {'status': 'error', 'message': str(e)}


class OTXAPIIntegration:
    """AlienVault OTX threat intelligence integration"""
    
    def __init__(self):
        self.api_key = os.getenv('OTX_API_KEY')
        self.base_url = "https://otx.alienvault.com/api/v1"
        if self.api_key:
            logger.info("OTX API initialized")
        else:
            logger.warning("OTX API key not configured")
    
    def check_indicator(self, indicator: str) -> Dict[str, Any]:
        """Check indicator against OTX database"""
        if not self.api_key:
            return {'status': 'error', 'message': 'API key not configured'}
        
        try:
            headers = {'X-OTX-API-KEY': self.api_key}
            
            # Determine indicator type
            if ':' in indicator:
                indicator_type = 'hostname'
            elif indicator.count('.') == 3:
                try:
                    [int(x) for x in indicator.split('.')]
                    indicator_type = 'IPv4'
                except:
                    indicator_type = 'domain'
            else:
                indicator_type = 'domain'
            
            url = f"{self.base_url}/indicators/{indicator_type}/{indicator}/general"
            response = requests.get(url, headers=headers, timeout=10)
            response.raise_for_status()
            
            data = response.json()
            return {
                'status': 'success',
                'indicator': indicator,
                'type': indicator_type,
                'pulse_info': data.get('pulse_info', {}),
                'validation': data.get('validation', []),
                'confidence': 0.90,
            }
        except Exception as e:
            logger.error(f"OTX check failed: {str(e)}")
            return {'status': 'error', 'message': str(e)}


class ShodanAPI:
    """Shodan threat intelligence integration"""
    
    def __init__(self):
        self.api_key = os.getenv('SHODAN_API_KEY')
        self.base_url = "https://api.shodan.io"
        if self.api_key:
            logger.info("Shodan API initialized")
        else:
            logger.warning("Shodan API key not configured")
    
    def host_lookup(self, ip_address: str) -> Dict[str, Any]:
        """Lookup host information on Shodan"""
        if not self.api_key:
            return {'status': 'error', 'message': 'API key not configured'}
        
        try:
            params = {
                'ip': ip_address,
                'key': self.api_key,
                'history': False,
                'minify': True
            }
            
            response = requests.get(
                f"{self.base_url}/shodan/host/{ip_address}",
                params=params,
                timeout=10
            )
            response.raise_for_status()
            
            data = response.json()
            return {
                'status': 'success',
                'ip': ip_address,
                'org': data.get('org'),
                'open_ports': data.get('ports', []),
                'services': data.get('data', []),
                'vulnerabilities': data.get('vulns', []),
                'confidence': 0.88,
            }
        except Exception as e:
            logger.error(f"Shodan lookup failed: {str(e)}")
            return {'status': 'error', 'message': str(e)}


class ThreatIntelAggregator:
    """Aggregates threat intelligence from all sources"""
    
    def __init__(self):
        self.vt = VirusTotalAPI()
        self.abuseipdb = AbuseIPDBAPI()
        self.otx = OTXAPIIntegration()
        self.shodan = ShodanAPI()
        logger.info("Threat Intelligence Aggregator initialized")
    
    def analyze_indicator(self, indicator: str) -> Dict[str, Any]:
        """Analyze indicator across all threat intelligence sources"""
        logger.info(f"Analyzing indicator: {indicator}")
        
        results = {
            'indicator': indicator,
            'timestamp': datetime.now().isoformat(),
            'sources': {},
            'aggregated_risk_score': 0.0,
        }
        
        # Detect indicator type and analyze accordingly
        if self._is_ip(indicator):
            results['sources']['abuseipdb'] = self.abuseipdb.check_ip(indicator)
            results['sources']['shodan'] = self.shodan.host_lookup(indicator)
        elif self._is_url(indicator):
            results['sources']['virustotal_url'] = self.vt.check_url(indicator)
        elif self._is_hash(indicator):
            results['sources']['virustotal_hash'] = self.vt.check_hash(indicator)
        else:
            results['sources']['otx'] = self.otx.check_indicator(indicator)
        
        # Calculate aggregated risk score
        risk_scores = []
        for source, data in results['sources'].items():
            if data.get('status') == 'success':
                if 'abuseConfidenceScore' in data:
                    risk_scores.append(data['abuseConfidenceScore'] / 100.0)
                elif 'detection_stats' in data:
                    detections = data['detection_stats'].get('malicious', 0)
                    total = data['detection_stats'].get('undetected', 0) + detections
                    if total > 0:
                        risk_scores.append(detections / total)
        
        if risk_scores:
            results['aggregated_risk_score'] = float(np.mean(risk_scores))
        
        return results
    
    @staticmethod
    def _is_ip(indicator: str) -> bool:
        try:
            parts = indicator.split('.')
            return len(parts) == 4 and all(0 <= int(p) <= 255 for p in parts)
        except:
            return False
    
    @staticmethod
    def _is_url(indicator: str) -> bool:
        return indicator.startswith('http://') or indicator.startswith('https://')
    
    @staticmethod
    def _is_hash(indicator: str) -> bool:
        return len(indicator) in [32, 40, 64]  # MD5, SHA1, SHA256


# Add numpy import at the top
import numpy as np
