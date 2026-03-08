from fastapi import APIRouter, HTTPException
import pandas as pd
import requests
import json
import os

router = APIRouter()

FILE_PATH = "uploads/data.csv"
OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
OLLAMA_API_URL = f"{OLLAMA_BASE_URL}/api/generate"
OLLAMA_MODEL = os.getenv("LLM_MODEL", "llama3.1:latest") # Ensure this model is pulled and running in Ollama

@router.post("/")
async def run_simulation():
    if not os.path.exists(FILE_PATH):
        raise HTTPException(status_code=400, detail="No dataset uploaded yet.")
    
    try:
        df = pd.read_csv(FILE_PATH)
        
        # Summarize the dataset to send to LLM
        summary = f"Columns: {', '.join(df.columns.tolist())}\n"
        summary += f"Total Rows: {len(df)}\n"
        summary += "Sample Statistics:\n"
        summary += df.describe(include='all').to_string()
        
        prompt = f"""
        Act as a Senior AI Risk Assessor.
        Analyze the following dataset summary. Note that it is being used to train a machine learning model.
        Summary:
        {summary[:2000]}
        
        Identify 3 critical real-world edge case scenarios that could happen if this data is flawed.
        Respond ONLY with a raw JSON object (no markdown formatting, no code blocks) matching this exact format:
        {{
            "overall_risk_score": 85,
            "risk_category": "HighRisk",
            "simulated_scenarios": [
                {{"name": "Scenario 1 Name", "impact": "High Risk"}},
                {{"name": "Scenario 2 Name", "impact": "Medium Risk"}},
                {{"name": "Scenario 3 Name", "impact": "Critical Risk"}}
            ],
            "explanation": "Brief 2-sentence explanation of why the risk score is what it is."
        }}
        """

        try:
            # Query Ollama
            response = requests.post(OLLAMA_API_URL, json={
                "model": OLLAMA_MODEL,
                "prompt": prompt,
                "stream": False,
                "format": "json"
            }, timeout=120)
            
            if response.status_code == 200:
                result = response.json()
                llama_response = result.get('response', '{}')
                parsed_json = json.loads(llama_response)
                
                # Format to match frontend
                return {
                    "overall_risk_score": parsed_json.get("overall_risk_score", 50),
                    "risk_category": str(parsed_json.get("risk_category", "Unknown")),
                    "simulated_scenarios": parsed_json.get("simulated_scenarios", []),
                    "explanation": parsed_json.get("explanation", "Could not explain.")
                }
            else:
                raise Exception("Ollama API returned an error")
                
        except Exception as e:
            print("Ollama Error:", e)
            # Fallback if Ollama is not running
            return {
                "overall_risk_score": 60,
                "risk_category": "Medium Risk",
                "simulated_scenarios": [
                    {"name": "Adversarial Attack (Fallback)", "impact": "High Risk"},
                    {"name": "Data Drift (Fallback)", "impact": "Medium Risk"},
                ],
                "explanation": f"Ollama connection failed ({str(e)}). This is a fallback response."
            }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
