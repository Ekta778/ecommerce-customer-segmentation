#!/usr/bin/env python3
"""
Streamlit Cloud Deployment Helper Script
This script helps prepare and validate your app for Streamlit Cloud deployment
"""

import os
import sys
import subprocess
import json
from pathlib import Path

def check_requirements():
    """Check if all required files exist"""
    required_files = [
        'streamlit_app.py',
        'requirements.txt',
        '.streamlit/config.toml'
    ]
    
    missing_files = []
    for file in required_files:
        if not os.path.exists(file):
            missing_files.append(file)
    
    if missing_files:
        print("❌ Missing required files:")
        for file in missing_files:
            print(f"   - {file}")
        return False
    
    print("✅ All required files present")
    return True

def validate_requirements():
    """Validate requirements.txt"""
    try:
        with open('requirements.txt', 'r') as f:
            requirements = f.read().strip().split('\n')
        
        print(f"📦 Found {len(requirements)} dependencies:")
        for req in requirements:
            if req.strip():
                print(f"   - {req}")
        
        return True
    except Exception as e:
        print(f"❌ Error reading requirements.txt: {e}")
        return False

def test_app_locally():
    """Test the app locally before deployment"""
    print("🧪 Testing app locally...")
    try:
        # Import the main app to check for syntax errors
        import streamlit_app
        print("✅ App imports successfully")
        return True
    except Exception as e:
        print(f"❌ App import failed: {e}")
        return False

def create_deployment_info():
    """Create deployment information"""
    info = {
        "app_name": "Customer Segmentation Analytics",
        "main_file": "streamlit_app.py",
        "python_version": "3.9.18",
        "streamlit_version": "1.29.0",
        "deployment_ready": True
    }
    
    with open('deployment_info.json', 'w') as f:
        json.dump(info, f, indent=2)
    
    print("📄 Created deployment_info.json")

def main():
    """Main deployment preparation function"""
    print("🚀 Streamlit Cloud Deployment Preparation")
    print("=" * 50)
    
    # Check all requirements
    if not check_requirements():
        sys.exit(1)
    
    if not validate_requirements():
        sys.exit(1)
    
    if not test_app_locally():
        sys.exit(1)
    
    create_deployment_info()
    
    print("\n✅ Deployment preparation complete!")
    print("\n📋 Streamlit Cloud Deployment Steps:")
    print("1. Push all files to your GitHub repository")
    print("2. Go to https://share.streamlit.io")
    print("3. Click 'New app'")
    print("4. Connect your GitHub account")
    print("5. Select your repository")
    print("6. Set main file path: streamlit_app.py")
    print("7. Click 'Deploy!'")
    print("\n🌐 Your app will be live at: https://your-app-name.streamlit.app")
    print("\n🧪 To test locally first, run:")
    print("streamlit run streamlit_app.py")

if __name__ == "__main__":
    main()
