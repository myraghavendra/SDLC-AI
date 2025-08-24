# Environment Variables Setup Guide

This guide explains how to set up environment variables for both local development and production deployments.

## Required Environment Variables

### Core Application Variables
- `PORT`: The port number the server should run on (default: 4000)

### OpenAI Integration
- `OPENAI_API_KEY`: Your OpenAI API key for generating user stories and acceptance criteria

### Jira Integration
- `JIRA_URL`: Your Jira instance URL (e.g., `https://your-company.atlassian.net`)
- `JIRA_USER`: Your Jira username/email
- `JIRA_API_TOKEN`: Your Jira API token
- `JIRA_PROJECT_KEY`: The project key where stories should be created

### Database (Optional)
- `DATABASE_URL`: Database connection string
- `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_HOST`, `POSTGRES_PORT`: PostgreSQL connection details

### Redis (Optional)
- `REDIS_URL`: Redis connection string

## Local Development Setup

### 1. Create a `.env` file
Create a `.env` file in the root directory of the project:

```bash
# Copy the example file
cp .env.example .env
```

### 2. Configure your environment variables
Edit the `.env` file with your actual values:

```env
# Server Configuration
PORT=4000

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Jira Configuration
JIRA_URL=https://your-company.atlassian.net
JIRA_USER=your.email@company.com
JIRA_API_TOKEN=your_jira_api_token_here
JIRA_PROJECT_KEY=YOUR_PROJECT_KEY

# Database (Optional)
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# Redis (Optional)
REDIS_URL=redis://localhost:6379
```

### 3. Install dependencies
```bash
npm install
```

### 4. Start the development server
```bash
npm run dev
```

## Production Deployment

### Vercel Deployment

#### Setting Environment Variables in Vercel

1. **Go to Vercel Dashboard**:
   - Navigate to your project in the [Vercel dashboard](https://vercel.com/dashboard)
   - Click on your project → Settings → Environment Variables

2. **Add Environment Variables**:
   - Add each required variable with its corresponding value
   - For sensitive values (API keys, tokens), use the "Encrypted" option
   - Set the appropriate environment (Production, Preview, Development)

3. **Required Variables for Vercel**:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   JIRA_URL=https://your-company.atlassian.net
   JIRA_USER=your.email@company.com
   JIRA_API_TOKEN=your_jira_api_token_here
   JIRA_PROJECT_KEY=YOUR_PROJECT_KEY
   ```

4. **Deploy**:
```bash
# Using Vercel CLI
npm install -g vercel
vercel --prod

# Or using package.json script
npm run deploy
```

#### Vercel Environment Detection
The application automatically detects when running on Vercel:
- Uses `VERCEL` and `VERCEL_ENV` environment variables
- Environment variables are loaded from Vercel's runtime environment
- No `.env` file is loaded in Vercel environment

### Railway Deployment
1. Add environment variables in the Railway dashboard
2. Deploy using the Railway CLI or GitHub integration

## Getting API Keys

### OpenAI API Key
1. Go to [OpenAI API](https://platform.openai.com/api-keys)
2. Create a new secret key
3. Copy the key and add it to your environment variables

### Jira API Token
1. Go to your Jira instance → Profile → Account settings
2. Navigate to Security → API token
3. Create a new API token
4. Use your email and this token for authentication

## Validation

The application includes built-in configuration validation. You can check the configuration status using:

### Using the Check Script
```bash
# Run the environment validation script
python check_env.py
```

### Manual Validation
```bash
# For JavaScript backend
node -e "require('dotenv').config(); console.log(process.env);"

# For Python backend
python src/backend_py/config.py
```

## Troubleshooting

### Common Issues

1. **Environment variables not loading**:
   - Ensure `.env` file is in the root directory
   - Check that variable names match exactly

2. **Jira authentication failures**:
   - Verify JIRA_URL format (should include https://)
   - Check that JIRA_USER is your email address
   - Ensure JIRA_API_TOKEN is correct

3. **OpenAI API errors**:
   - Verify OPENAI_API_KEY starts with "sk-"
   - Check your OpenAI account billing status

### Debug Mode
Enable debug logging by setting:
```env
DEBUG=true
```

## Security Notes

- Never commit `.env` files to version control
- Use different API keys for development and production
- Rotate API keys regularly
- Use environment-specific configuration files

## Example `.env.example` File

```env
# Server Configuration
PORT=4000

# OpenAI Configuration
OPENAI_API_KEY=sk-your_openai_api_key_here

# Jira Configuration
JIRA_URL=https://your-company.atlassian.net
JIRA_USER=your.email@company.com
JIRA_API_TOKEN=your_jira_api_token_here
JIRA_PROJECT_KEY=PROJ

# Database (Optional)
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# Redis (Optional)
REDIS_URL=redis://localhost:6379

# Debug
DEBUG=false
