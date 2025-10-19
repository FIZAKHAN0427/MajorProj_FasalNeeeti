#!/usr/bin/env python3
"""
Test script for notebook model integration
"""
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend', 'ml'))

try:
    from notebook_model import predict_yield
    
    # Test prediction
    result = predict_yield(
        state="Uttar Pradesh",
        district="LUCKNOW", 
        crop="Rice",
        season="Kharif",
        year=2020,
        area=100.0
    )
    
    print("✅ Notebook model test successful!")
    print(f"Predicted yield: {result['predicted_yield']:.2f}")
    print(f"Confidence: {result['confidence']:.1f}%")
    print(f"Model: {result['model_used']}")
    
except Exception as e:
    print(f"❌ Notebook model test failed: {e}")
    print("Make sure the model files are in backend/notebooks/ folder")