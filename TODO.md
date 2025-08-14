# Vercel Environment Variables Update - TODO

## Files to Update

### 1. Core Configuration
- [x] Update `src/backend_py/config.py` to use Vercel environment variables
- [x] Update `src/backend_py/server.py` to use centralized config

### 2. API Files
- [x] Update `src/backend_py/generate_api.py` to use config
- [x] Update `src/backend_py/upload_jira_api.py` to use config
- [x] Update `src/backend_py/get_stories_api.py` to use config
- [x] Update `src/backend_py/requirement_analyser_api.py` to use config
- [x] Update `src/backend_py/jira_config_api.py` to use config

### 3. Deployment Configuration
- [x] Update `vercel.json` for proper Vercel deployment

### 4. Testing & Verification
- [ ] Test all endpoints work correctly
- [ ] Verify environment variables are properly loaded

## Summary of Changes
- Updated config.py to use VercelSecretsManager instead of RailwaySecretsManager
- Updated all API files to use centralized config functions (get_jira_config, get_openai_api_key)
- Updated vercel.json to properly route API calls to the Python backend
- All environment variables (JIRA_API_TOKEN, JIRA_PROJECT_KEY, JIRA_URL, JIRA_USER, OPENAI_API_KEY) now use Vercel environment variables
