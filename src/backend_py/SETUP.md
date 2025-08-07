# OpenAI API Key Setup Guide

## Problem
The backend is failing to start because the `OPENAI_API_KEY` environment variable is not set.

## Solution

### Step 1: Configure OpenAI API Key

1. **Create your .env file** (if it doesn't exist):
   ```bash
   cp src/backend_py/.env.example src/backend_py/.env
   ```

2. **Edit the .env file** and add your OpenAI API key:
   ```bash
   # OpenAI Configuration
   OPENAI_API_KEY=your_actual_openai_api_key_here
   
   # Jira Configuration (optional)
   JIRA_SERVER=https://your-domain.atlassian.net
   JIRA_EMAIL=your-email@company.com
   JIRA_API_TOKEN=your_jira_api_token_here
   ```

### Step 2: Get Your OpenAI API Key

1. Go to [OpenAI API Keys](https://platform.openai.com/api-keys)
2. Create a new API key or use an existing one
3. Copy the key and paste it into your `.env` file

### Step 3: Verify Configuration

The backend has been updated to handle missing API keys gracefully. You can check if OpenAI is configured by:

1. **Starting the backend**:
   ```bash
   cd src/backend_py
   python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

2. **Testing the configuration**:
   ```bash
   curl http://localhost:8000/api/health
   ```

### Step 4: Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `OPENAI_API_KEY` | Your OpenAI API key | `sk-1234567890abcdef...` |
| `JIRA_SERVER` | Your Jira server URL | `https://yourcompany.atlassian.net` |
| `JIRA_EMAIL` | Your Jira email | `user@company.com` |
| `JIRA_API_TOKEN` | Your Jira API token | `1234567890abcdef...` |

### Step 5: Troubleshooting

If you still encounter issues:

1. **Check if .env file exists**:
   ```bash
   ls -la src/backend_py/.env
   ```

2. **Verify environment variables are loaded**:
   ```bash
   python -c "from src.backend_py.config import is_openai_configured; print(is_openai_configured())"
   ```

3. **Check logs for specific errors**:
   ```bash
   tail -f backend.log
   ```

### Alternative: Using Environment Variables Directly

Instead of using a .env file, you can also set environment variables directly:

**Linux/Mac:**
```bash
export OPENAI_API_KEY=your_key_here
```

**Windows (Command Prompt):**
```cmd
set OPENAI_API_KEY=your_key_here
```

**Windows (PowerShell):**
```powershell
$env:OPENAI_API_KEY="your_key_here"
```

## Features with/without OpenAI

**With OpenAI API Key:**
- AI-powered story generation
- Automated acceptance criteria creation
- Technical notes generation
- Test case generation

**Without OpenAI API Key:**
- Basic Jira integration
- Manual story creation
- Manual acceptance criteria
- Manual test case creation

## Security Notes

- Never commit your actual `.env` file to version control
- Use `.env.example` as a template
- Rotate your API keys regularly
- Use environment-specific configurations for different environments
