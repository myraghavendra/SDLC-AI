# Deployment Guide - SDLC AI Dashboard

This guide provides step-by-step instructions to deploy the frontend to GitHub Pages and the backend to Railway.

## Prerequisites

- GitHub account with repository access
- Railway account (https://railway.app)
- Node.js 18+ installed locally
- Git configured with your credentials

## Backend Deployment (Railway)

### 1. Railway Setup
1. Go to [Railway](https://railway.app) and create an account
2. Create a new project
3. Connect your GitHub repository to Railway

### 2. Environment Variables
Set the following environment variables in Railway:
- `PORT`: Railway will set this automatically
- `OPENAI_API_KEY`: Your OpenAI API key
- `JIRA_BASE_URL`: Your Jira instance URL
- `JIRA_USERNAME`: Your Jira username
- `JIRA_API_TOKEN`: Your Jira API token

### 3. Deploy Backend
1. Railway will automatically detect the Python backend
2. The railway.json file is configured for proper deployment
3. Railway will install dependencies from requirements.txt
4. The backend will be accessible at: `https://your-project.railway.app`

## Frontend Deployment (GitHub Pages)

### 1. GitHub Pages Setup
1. Go to your repository settings
2. Navigate to Pages section
3. Select "GitHub Actions" as the source

### 2. GitHub Secrets
Add the following secret to your repository:
- `RAILWAY_BACKEND_URL`: The URL of your deployed Railway backend (e.g., `https://your-project.railway.app`)

### 3. Automatic Deployment
The GitHub Actions workflow will automatically:
- Build the frontend on every push to main branch
- Deploy to GitHub Pages
- Use the Railway backend URL from the secret

### 4. Frontend URL
Your frontend will be accessible at: `https://yourusername.github.io/SDLC-AI`

## Linking Frontend and Backend

### 1. Update Frontend Configuration
The frontend is already configured to use the Railway backend URL via the `RAILWAY_BACKEND_URL` secret.

### 2. CORS Configuration
The backend is configured to allow CORS from any origin. For production, you may want to restrict this to your frontend URL.

### 3. Testing the Integration
1. Deploy backend to Railway
2. Update the GitHub secret with the Railway URL
3. Push changes to trigger frontend deployment
4. Test the integration by accessing the frontend URL

## Quick Start Commands

### Deploy Backend to Railway
```bash
# Railway will handle this automatically when connected to GitHub
# No manual commands needed
```

### Deploy Frontend via GitHub Actions
```bash
# Push to main branch to trigger deployment
git add .
git commit -m "Deploy updates"
git push origin main
```

## Troubleshooting

### Backend Issues
- Check Railway logs for deployment errors
- Verify environment variables are set correctly
- Ensure all dependencies are in requirements.txt

### Frontend Issues
- Check GitHub Actions logs for build errors
- Verify the RAILWAY_BACKEND_URL secret is set correctly
- Check browser console for CORS or API errors

## URLs After Deployment
- **Frontend**: `https://yourusername.github.io/SDLC-AI`
- **Backend**: `https://your-project.railway.app`

## Support
If you encounter issues, check the deployment logs in:
- Railway dashboard (for backend)
- GitHub Actions tab (for frontend)
