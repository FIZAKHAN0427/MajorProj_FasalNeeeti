#!/usr/bin/env python3
"""
Script to export trained Random Forest model from notebook
Run this in the same environment as your Jupyter notebook
"""
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import joblib
from pathlib import Path

def create_and_export_model():
    """Create and export the Random Forest model based on notebook analysis"""
    
    # Load APY dataset (adjust path as needed)
    try:
        df = pd.read_csv('APY.csv')
        print(f"✅ Loaded dataset with {len(df)} records")
    except FileNotFoundError:
        print("❌ APY.csv not found. Please ensure the dataset is in the current directory.")
        return
    
    # Prepare features (based on notebook analysis)
    # Encode categorical variables
    le_crop = LabelEncoder()
    le_season = LabelEncoder()
    le_state = LabelEncoder()
    le_district = LabelEncoder()
    
    df['crop_encoded'] = le_crop.fit_transform(df['Crop'])
    df['season_encoded'] = le_season.fit_transform(df['Season'])
    df['state_encoded'] = le_state.fit_transform(df['State_Name'])
    df['district_encoded'] = le_district.fit_transform(df['District_Name'])
    
    # Add synthetic features (NDVI, soil_ph, temp_avg, humidity)
    np.random.seed(42)
    df['ndvi_mean'] = np.random.uniform(0.3, 0.8, len(df))
    df['soil_ph'] = np.random.uniform(5.5, 8.5, len(df))
    df['temp_avg'] = np.random.uniform(15, 40, len(df))
    df['humidity'] = np.random.uniform(30, 90, len(df))
    
    # Select features
    features = ['crop_encoded', 'season_encoded', 'state_encoded', 'district_encoded', 
               'Year', 'Area', 'ndvi_mean', 'soil_ph', 'temp_avg', 'humidity']
    
    X = df[features]
    y = df['Production']  # or 'Yield' depending on your target
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Train Random Forest model (matching notebook parameters)
    rf_model = RandomForestRegressor(
        n_estimators=200,
        random_state=42,
        n_jobs=-1
    )
    
    print("🔄 Training Random Forest model...")
    rf_model.fit(X_train, y_train)
    
    # Evaluate model
    train_score = rf_model.score(X_train, y_train)
    test_score = rf_model.score(X_test, y_test)
    
    print(f"✅ Model trained successfully!")
    print(f"📊 Train R² Score: {train_score:.3f}")
    print(f"📊 Test R² Score: {test_score:.3f}")
    
    # Export model
    model_path = Path(__file__).parent / 'trained_model.pkl'
    joblib.dump(rf_model, model_path)
    print(f"💾 Model exported to: {model_path}")
    
    # Export encoders
    encoders = {
        'crop': le_crop,
        'season': le_season,
        'state': le_state,
        'district': le_district
    }
    
    encoders_path = Path(__file__).parent / 'encoders.pkl'
    joblib.dump(encoders, encoders_path)
    print(f"💾 Encoders exported to: {encoders_path}")
    
    return rf_model

if __name__ == '__main__':
    create_and_export_model()