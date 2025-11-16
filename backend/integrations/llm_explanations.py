"""
LLM Integration for Threat Analysis Explanations
Uses Hugging Face, OpenAI, or Anthropic for explainable AI
"""

import os
import logging
from typing import Dict, Any
import requests
from datetime import datetime

logger = logging.getLogger(__name__)


class HuggingFaceLLM:
    """Hugging Face LLM for threat explanations"""
    
    def __init__(self):
        self.api_key = os.getenv('HUGGINGFACE_API_KEY')
        self.model = os.getenv('HUGGINGFACE_MODEL', 'mistral-7b-instruct')
        self.api_url = f"https://api-inference.huggingface.co/models/{self.model}"
        self.headers = {"Authorization": f"Bearer {self.api_key}"} if self.api_key else {}
        if self.api_key:
            logger.info(f"Hugging Face LLM initialized with model: {self.model}")
        else:
            logger.warning("Hugging Face API key not configured")
    
    def generate_explanation(self, threat_data: Dict[str, Any]) -> str:
        """Generate natural language explanation of threat analysis"""
        if not self.api_key:
            return self._generate_fallback_explanation(threat_data)
        
        prompt = self._build_prompt(threat_data)
        
        try:
            payload = {
                "inputs": prompt,
                "parameters": {
                    "max_length": 500,
                    "temperature": 0.7,
                    "top_p": 0.95,
                }
            }
            
            response = requests.post(self.api_url, headers=self.headers, json=payload, timeout=15)
            response.raise_for_status()
            
            result = response.json()
            if isinstance(result, list) and len(result) > 0:
                explanation = result[0].get('generated_text', '').replace(prompt, '').strip()
                logger.info("Generated threat explanation using Hugging Face LLM")
                return explanation
            
            return self._generate_fallback_explanation(threat_data)
        
        except Exception as e:
            logger.error(f"LLM generation failed: {str(e)}")
            return self._generate_fallback_explanation(threat_data)
    
    def _build_prompt(self, threat_data: Dict[str, Any]) -> str:
        """Build prompt for LLM from threat data"""
        threat_level = threat_data.get('threat_level', 'Unknown')
        score = threat_data.get('combined_score', 0)
        detected = threat_data.get('detected_threats', [])
        
        threat_desc = ', '.join([t.get('type', 'unknown') for t in detected[:3]]) if detected else 'no specific threats'
        
        prompt = f"""Analyze this cybersecurity threat detection result and provide a brief, technical explanation:

Threat Level: {threat_level}
Threat Score: {score:.2%}
Detected Threats: {threat_desc}

Provide a concise explanation of:
1. What this threat score means
2. The detected threats
3. Recommended actions (in 2-3 sentences max)

Explanation:"""
        
        return prompt
    
    def _generate_fallback_explanation(self, threat_data: Dict[str, Any]) -> str:
        """Generate explanation without LLM"""
        threat_level = threat_data.get('threat_level', 'Unknown')
        score = threat_data.get('combined_score', 0)
        detected = threat_data.get('detected_threats', [])
        
        explanations = {
            'Critical': "This is a critical threat with high malicious indicators. Immediate action is required.",
            'High': "This is a high-severity threat. Strong evidence of malicious activity has been detected.",
            'Medium': "This is a medium-level threat. Further investigation is recommended.",
            'Low': "This is a low-level threat. Monitor but minimal immediate action required.",
            'Very Low': "Minimal threat indicators detected. No immediate action required."
        }
        
        base_explanation = explanations.get(threat_level, "Threat analysis complete.")
        
        threat_details = ""
        if detected:
            threat_types = [t.get('type', 'unknown') for t in detected[:3]]
            threat_details = f" Detected: {', '.join(threat_types)}."
        
        actions = {
            'Critical': ' Isolate affected systems immediately.',
            'High': ' Investigate and consider quarantine.',
            'Medium': ' Review logs and monitor activity.',
            'Low': ' Add to watchlist.',
            'Very Low': ' No action needed.'
        }
        
        return f"{base_explanation}{threat_details}{actions.get(threat_level, '')}"
