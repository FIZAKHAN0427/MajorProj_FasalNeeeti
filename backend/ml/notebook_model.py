#!/usr/bin/env python3
"""
Use trained models from notebooks folder - Random Forest with 91.5% accuracy
"""
import pickle
import sys
import json
import os
import numpy as np
from pathlib import Path

def load_notebook_models():
    """Load trained models from notebooks folder"""
    notebooks_path = Path(__file__).parent.parent / 'notebooks'
    
    try:
        # Load main Random Forest model (91.5% R² Score)
        with open(notebooks_path / 'crop_yield_model.pkl', 'rb') as f:
            model = pickle.load(f)
        
        # Load label encoders
        encoders = {}
        encoder_files = ['State_encoder.pkl', 'District_encoder.pkl', 'Crop_encoder.pkl', 'Season_encoder.pkl']
        
        for encoder_file in encoder_files:
            try:
                with open(notebooks_path / encoder_file, 'rb') as f:
                    encoder_name = encoder_file.replace('_encoder.pkl', '')
                    encoders[encoder_name] = pickle.load(f)
            except FileNotFoundError:
                print(f"Warning: {encoder_file} not found")
        
        return model, encoders
    except Exception as e:
        print(f"Error loading models: {e}")
        return None, None

def safe_transform(encoder, value, default_value=0):
    """Safely transform categorical values, handle unknown labels"""
    try:
        if encoder is not None and value in encoder.classes_:
            return encoder.transform([value])[0]
        else:
            print(f"Warning: Unknown value '{value}' for encoder. Using default {default_value}")
            return default_value
    except Exception as e:
        print(f"Transform error: {e}. Using default {default_value}")
        return default_value

def predict_yield(state, district, crop, season, year, area=100.0):
    """Make prediction using trained Random Forest model"""
    try:
        model, encoders = load_notebook_models()
        
        if model is None:
            raise Exception("Could not load trained model")
        
        print(f"Using trained model for: {state}, {district}, {crop}, {season}, {year}, {area}")
        
        # Encode categorical features using trained encoders
        encoded_state = safe_transform(encoders.get('State'), state, 0)
        encoded_district = safe_transform(encoders.get('District'), district, 0)
        encoded_crop = safe_transform(encoders.get('Crop'), crop, 0)
        encoded_season = safe_transform(encoders.get('Season'), season, 0)
        
        print(f"Encoded features: State={encoded_state}, District={encoded_district}, Crop={encoded_crop}, Season={encoded_season}")
        
        # Create feature vector matching training format: [State, District, Crop, Crop_Year, Season, Area]
        features = np.array([
            encoded_state,
            encoded_district, 
            encoded_crop,
            int(year),
            encoded_season,
            float(area)
        ]).reshape(1, -1)
        
        print(f"Feature vector: {features}")
        
        # Make prediction using trained Random Forest
        prediction = model.predict(features)[0]
        print(f"Raw model prediction: {prediction}")
        
        # Calculate total production
        total_production = prediction * float(area) * 1000  # Convert to kg
        
        result = {
            'predicted_yield': max(0, round(float(prediction), 2)),
            'total_production': max(0, round(float(total_production))),
            'confidence': 91.5,  # Model R² Score from notebook
            'model_used': 'RandomForest_Trained_91.5%',
            'r2_score': 0.915,
            'mae': 14.83,
            'features_used': {
                'state': state,
                'district': district,
                'crop': crop,
                'season': season,
                'year': int(year),
                'area': float(area)
            }
        }
        
        print(f"Final result: {result}")
        return result
        
    except Exception as e:
        print(f"Trained model prediction error: {e}")
        import traceback
        traceback.print_exc()
        raise Exception(f"Trained model prediction failed: {e}")

if __name__ == '__main__':
    if len(sys.argv) < 6:
        print("Usage: python notebook_model.py <state> <district> <crop> <season> <year> [area]")
        sys.exit(1)
    
    state = sys.argv[1]
    district = sys.argv[2]
    crop = sys.argv[3]
    season = sys.argv[4]
    year = sys.argv[5]
    area = float(sys.argv[6]) if len(sys.argv) > 6 else 100.0
    
    result = predict_yield(state, district, crop, season, year, area)
    print(json.dumps(result))