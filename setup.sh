#!/bin/bash

# Streamlit Cloud Deployment Setup Script
echo "🚀 Setting up Streamlit Customer Segmentation App for deployment..."

# Create necessary directories
mkdir -p .streamlit
mkdir -p data

# Install dependencies locally for testing
echo "📦 Installing dependencies..."
pip install -r requirements.txt

echo "✅ Setup complete!"
echo ""
echo "📋 Next steps for Streamlit Cloud deployment:"
echo "1. Push these files to your GitHub repository"
echo "2. Go to https://share.streamlit.io"
echo "3. Connect your GitHub account"
echo "4. Select your repository"
echo "5. Set main file path to: streamlit_app.py"
echo "6. Click 'Deploy!'"
echo ""
echo "🧪 To test locally, run:"
echo "streamlit run streamlit_app.py"
