"""
Intrusion Detection System (IDS) Pipeline
Processes network traffic and behavioral data
"""

import logging
import numpy as np
from typing import Dict, List, Any
from datetime import datetime

logger = logging.getLogger(__name__)


class IDSPipeline:
    """IDS data processing and anomaly detection pipeline"""
    
    def __init__(self):
        self.preprocessor = IDSDataPreprocessor()
        self.alert_threshold = 0.75
        logger.info("Initialized IDS Pipeline")
    
    def process_network_traffic(self, packets: List[Dict]) -> Dict[str, Any]:
        """Process and analyze network traffic packets"""
        
        logger.info(f"Processing {len(packets)} network packets")
        
        # Convert packets to feature vectors
        features = self.preprocessor.extract_features(packets)
        
        # Simulated anomaly detection
        anomaly_scores = np.random.uniform(0, 1, len(packets))
        alerts = []
        
        for idx, (packet, score) in enumerate(zip(packets, anomaly_scores)):
            if score > self.alert_threshold:
                alerts.append({
                    'packet_id': idx,
                    'src_ip': packet.get('src_ip', 'unknown'),
                    'dst_ip': packet.get('dst_ip', 'unknown'),
                    'port': packet.get('port', 'unknown'),
                    'anomaly_score': float(score),
                    'alert_type': self._classify_alert(packet, score),
                })
        
        return {
            'total_packets': len(packets),
            'anomalies_detected': len(alerts),
            'anomaly_rate': float(np.mean(anomaly_scores)),
            'alerts': alerts,
            'timestamp': datetime.now().isoformat(),
        }
    
    def _classify_alert(self, packet: Dict, score: float) -> str:
        """Classify the type of security alert"""
        if score > 0.9:
            return 'Potential DDoS Attack'
        elif score > 0.8:
            return 'Port Scanning Detected'
        elif score > 0.75:
            return 'Unusual Traffic Pattern'
        return 'Anomaly Detected'
    
    def process_user_behavior(self, events: List[Dict]) -> Dict[str, Any]:
        """Analyze user behavior for insider threats"""
        
        logger.info(f"Analyzing {len(events)} user behavior events")
        
        # Simulated behavioral analysis
        suspicious_events = []
        for event in events:
            if event.get('action') in ['file_delete', 'data_export', 'privilege_change']:
                suspicious_events.append({
                    'user': event.get('user'),
                    'action': event.get('action'),
                    'timestamp': event.get('timestamp'),
                    'risk_score': np.random.uniform(0.5, 1.0),
                })
        
        return {
            'total_events': len(events),
            'suspicious_events': len(suspicious_events),
            'events': suspicious_events,
        }


class IDSDataPreprocessor:
    """Preprocesses raw network data for IDS analysis"""
    
    def extract_features(self, packets: List[Dict]) -> np.ndarray:
        """Extract ML features from network packets"""
        features = []
        
        for packet in packets:
            packet_features = [
                len(packet.get('payload', '')),
                hash(packet.get('protocol', '')) % 256,
                hash(packet.get('src_ip', '')) % 256,
                hash(packet.get('dst_ip', '')) % 256,
            ]
            features.append(packet_features)
        
        return np.array(features) if features else np.array([])
    
    def normalize_features(self, features: np.ndarray) -> np.ndarray:
        """Normalize feature vectors to 0-1 range"""
        if features.size == 0:
            return features
        
        min_vals = np.min(features, axis=0)
        max_vals = np.max(features, axis=0)
        
        return (features - min_vals) / (max_vals - min_vals + 1e-6)
