#!/usr/bin/env python3
"""
Real model trainer using actual multimodal_crop_dataset.csv
"""
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_absolute_error
import pickle
import os

def train_real_model():
    """Train model using actual multimodal_crop_dataset.csv"""
    print("Loading multimodal_crop_dataset.csv...")
    
    # Load the actual dataset
    df = pd.read_csv('multimodal_crop_dataset.csv')
    
    # Clean column names
    df.columns = df.columns.str.strip()
    
    print(f"Dataset loaded: {len(df)} records")
    print(f"Columns: {df.columns.tolist()}")
    
    # Remove rows with missing yield
    df = df.dropna(subset=['Yield'])
    df = df[df['Yield'] > 0]
    
    print(f"After cleaning: {len(df)} records")
    
    # Filter for supported crops
    supported_crops = ['Rice', 'Wheat', 'Maize', 'Sugarcane', 'Cotton']
    df = df[df['Crop'].isin(supported_crops)]
    
    print(f"Supported crops only: {len(df)} records")
    print(f"Crop distribution: {df['Crop'].value_counts().to_dict()}")
    
    # Encode categorical variables
    encoders = {}
    for col in ['State', 'District', 'Crop', 'Season']:
        le = LabelEncoder()
        df[f'{col}_encoded'] = le.fit_transform(df[col].astype(str))
        encoders[col] = le
        print(f"Encoded {col}: {len(le.classes_)} unique values")
    
    # Prepare features
    feature_cols = ['State_encoded', 'District_encoded', 'Crop_encoded', 
                   'Season_encoded', 'Crop_Year', 'Area', 'NDVI_mean', 
                   'rainfall_mm', 'temp_avg', 'soil_pH']
    
    X = df[feature_cols]
    y = df['Yield']
    
    print(f"Feature matrix shape: {X.shape}")
    print(f"Target range: {y.min():.2f} - {y.max():.2f}")
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=df['Crop']
    )
    
    print(f"Training samples: {len(X_train)}")
    print(f"Test samples: {len(X_test)}")
    
    # Train Random Forest model
    print("Training Random Forest model...")
    model = RandomForestRegressor(
        n_estimators=200,
        max_depth=15,
        min_samples_split=5,
        min_samples_leaf=2,
        random_state=42,
        n_jobs=-1
    )
    
    model.fit(X_train, y_train)
    
    # Evaluate
    y_pred = model.predict(X_test)
    r2 = r2_score(y_test, y_pred)
    mae = mean_absolute_error(y_test, y_pred)
    
    print(f"\nModel Performance:")
    print(f"R² Score: {r2:.4f}")
    print(f"MAE: {mae:.2f}")
    print(f"Accuracy: {r2*100:.1f}%")
    
    # Feature importance
    feature_importance = dict(zip(feature_cols, model.feature_importances_))
    print(f"\nTop 5 Important Features:")
    for feat, imp in sorted(feature_importance.items(), key=lambda x: x[1], reverse=True)[:5]:
        print(f"  {feat}: {imp:.3f}")
    
    # Save model
    model_data = {
        'model': model,
        'encoders': encoders,
        'feature_cols': feature_cols,
        'performance': {
            'r2_score': r2,
            'mae': mae,
            'accuracy': r2*100,
            'training_samples': len(X_train),
            'test_samples': len(X_test)
        }
    }
    
    with open('trained_crop_model.pkl', 'wb') as f:
        pickle.dump(model_data, f)
    
    print(f"\nModel saved as trained_crop_model.pkl")
    
    # Test prediction
    print(f"\nTesting prediction...")
    test_prediction = predict_yield_real('Lucknow', 'Rice', 'Kharif', 2024)
    print(f"Test prediction for Rice in Lucknow (Kharif 2024): {test_prediction:.1f} quintals/hectare")
    
    return r2

def predict_yield_real(district, crop, season, year):
    """Make prediction using trained model"""
    try:
        with open('trained_crop_model.pkl', 'rb') as f:
            model_data = pickle.load(f)
        
        model = model_data['model']
        encoders = model_data['encoders']
        feature_cols = model_data['feature_cols']
        
        # Create input data with defaults
        input_data = {
            'State': 'Uttar Pradesh',  # Default state
            'District': district,
            'Crop': crop,
            'Season': season,
            'Crop_Year': year,
            'Area': 100.0,  # Default area
            'NDVI_mean': 0.65,  # Default NDVI
            'rainfall_mm': 200.0,  # Default rainfall
            'temp_avg': 25.0,  # Default temperature
            'soil_pH': 6.8  # Default soil pH
        }
        
        # Encode categorical variables
        for col in ['State', 'District', 'Crop', 'Season']:
            try:
                input_data[f'{col}_encoded'] = encoders[col].transform([input_data[col]])[0]
            except ValueError:
                # Handle unknown categories
                input_data[f'{col}_encoded'] = 0
        
        # Create feature vector
        features = [[input_data[col] for col in feature_cols]]
        prediction = model.predict(features)[0]
        
        return max(0, prediction)  # Ensure non-negative
        
    except Exception as e:
        print(f"Prediction error: {e}")
        # Fallback predictions based on crop type
        fallback_yields = {
            'Rice': 25.0, 'Wheat': 30.0, 'Maize': 40.0, 
            'Sugarcane': 650.0, 'Cotton': 15.0
        }
        return fallback_yields.get(crop, 25.0)

if __name__ == '__main__':
    try:
        print("=== REAL MODEL TRAINING ===")
        print("Using actual multimodal_crop_dataset.csv")
        print("NO SYNTHETIC DATA - REAL APY DATASET ONLY")
        print("=" * 40)
        
        r2_score = train_real_model()
        
        print(f"\n🎉 SUCCESS! Model trained with R² = {r2_score:.4f}")
        print(f"📊 This is a REAL model using actual agricultural data")
        print(f"📁 Model saved as 'trained_crop_model.pkl'")
        
    except FileNotFoundError:
        print("❌ ERROR: multimodal_crop_dataset.csv not found!")
        print("Please ensure the dataset is in the current directory.")
    except Exception as e:
        print(f"❌ ERROR: {e}")