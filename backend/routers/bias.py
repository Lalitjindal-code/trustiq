from fastapi import APIRouter, HTTPException
import pandas as pd
from fairlearn.metrics import demographic_parity_difference, equalized_odds_difference
import os

router = APIRouter()

FILE_PATH = "uploads/data.csv"

@router.post("/")
async def run_bias_detection():
    if not os.path.exists(FILE_PATH):
        raise HTTPException(status_code=400, detail="No dataset uploaded yet.")
    
    try:
        df = pd.read_csv(FILE_PATH)
        
        # Simple heuristic to find a sensitive column
        sensitive_cols = [c for c in df.columns if str(c).lower() in ['gender', 'sex', 'race', 'ethnicity', 'age']]
        # Simple heuristic to find a target column (binary)
        target_cols = [c for c in df.columns if df[c].nunique() == 2]
        
        issues = []
        dp_diff = 0.0
        eo_diff = 0.0
        score = 100.0

        if not sensitive_cols:
            issues.append("No sensitive columns detected (e.g., gender, race)")
        elif not target_cols:
            issues.append("No binary target column detected (e.g., approval/rejection)")
        else:
            sensitive_col = sensitive_cols[0]
            target_col = target_cols[-1] # take the last binary column, usually the target
            
            # Ensure target is numeric binary {0,1}
            y_true = pd.to_numeric(df[target_col], errors='coerce').fillna(0).astype(int)
            sensitive_features = df[sensitive_col].fillna("Unknown")
            
            # Since we don't have predictions yet, we evaluate bias in the ground truth labels
            # This computes bias in the dataset itself, effectively looking at label assignment disparity
            dp_diff = demographic_parity_difference(y_true, y_true, sensitive_features=sensitive_features)
            
            # Calculate a bias score out of 100 based on the dp_diff
            # dp_diff goes from 0 to 1, where 0 is perfect parity.
            score = max(0.0, 100.0 - (dp_diff * 100.0))
            
            issues.append(f"Analyzed sensitive feature '{sensitive_col}' against target '{target_col}'.")
            if dp_diff > 0.1:
                issues.append(f"Demographic Parity Difference is high: {dp_diff:.3f}. Dataset labels are heavily skewed against a specific group.")
            else:
                issues.append(f"Demographic Parity is acceptable ({dp_diff:.3f}).")
                
        return {
            "bias_score": round(score, 1),
            "demographic_parity": round(1.0 - dp_diff, 2), # 1.0 is perfect parity
            "equal_opportunity": round(1.0 - eo_diff, 2), # Placeholder, as we don't have y_pred for true Equal Opp
            "disparate_impact": round(1.0 - dp_diff, 2), # Placeholder for DI
            "issues": issues
        }
    except Exception as e:
        print(f"CRITICAL BIAS ERROR: {str(e)}") # Log for Render logs
        raise HTTPException(status_code=500, detail=str(e))
