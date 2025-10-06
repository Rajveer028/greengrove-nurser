#!/bin/bash

# GreenGrove Deployment Script
echo "🌿 GreenGrove Deployment Script"
echo "================================"

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📁 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit - GreenGrove Nursery Management System"
    echo "✅ Git repository initialized"
else
    echo "✅ Git repository already exists"
fi

# Check if we're connected to a remote
if ! git remote | grep -q origin; then
    echo "🔗 Please add your GitHub repository as origin:"
    echo "git remote add origin https://github.com/YOUR_USERNAME/greengrove-nursery.git"
    echo "git branch -M main"
    echo "git push -u origin main"
else
    echo "✅ Remote origin already configured"
fi

echo ""
echo "🚀 Next Steps:"
echo "1. Push your code to GitHub:"
echo "   git add ."
echo "   git commit -m 'Ready for deployment'"
echo "   git push origin main"
echo ""
echo "2. Deploy on Vercel:"
echo "   - Go to https://vercel.com"
echo "   - Sign up/Login with GitHub"
echo "   - Click 'New Project'"
echo "   - Import your repository"
echo "   - Click 'Deploy'"
echo ""
echo "3. Your site will be live at: https://your-project.vercel.app"
echo ""
echo "📖 For detailed instructions, see DEPLOYMENT_GUIDE.md"
echo ""
echo "🌿 Happy Deploying! 🌿"
