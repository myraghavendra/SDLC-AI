# Deployment Checklist for Fixing NOT_FOUND Error

## ✅ Completed Steps

### 1. Vercel Configuration
- [x] Updated `vercel.json` with proper routing configuration
- [x] Ensured `/api/(.*)` routes properly forward to `/api/index.py`
- [x] Updated Python requirements in `src/backend_py/requirements.txt`

### 2. Backend Verification
- [x] Verified all API endpoints are correctly registered in `server.py`
- [x] Confirmed `/api/generate` endpoint exists in `generate_api.py`
- [x] Confirmed `/api/integrated-story` endpoint exists in `integrated_story_api.py`
- [x] All routers are properly included in the FastAPI app

### 3. Frontend Verification
- [x] Identified that frontend components call:
  - `/api/generate` (StorySelectionPage.tsx, GenerateAcceptanceCriteriaPage.tsx)
  - `/api/integrated-story` (TestCaseGenerationPage.tsx)

## 🔧 Next Steps for Deployment

### 1. Environment Variables (Vercel Dashboard)
Ensure these are set in Vercel dashboard:
- `OPENAI_API_KEY` - OpenAI API key
- `JIRA_URL` - JIRA instance URL
- `JIRA_API_TOKEN` - JIRA API token
- `JIRA_USER` - JIRA username
- `DATABASE_URL` - PostgreSQL database URL (optional)
- `REDIS_URL` - Redis URL (optional)

### 2. Deploy to Vercel
```bash
# Deploy the application
vercel --prod

# Or if using Vercel CLI
vercel deploy --prod
```

### 3. Test After Deployment
```bash
# Test the endpoints
python test_api_endpoints.py

# Or test manually:
curl -X POST https://sdlc-ai.vercel.app/api/generate \
  -H "Content-Type: application/json" \
  -d '{"description": "Test story", "framework": "Cypress"}'

curl -X POST https://sdlc-ai.vercel.app/api/integrated-story \
  -H "Content-Type: application/json" \
  -d '{"tool": "Test", "stories": [{"key": "TEST-1", "title": "Test", "description": "Test"}]}'
```

### 4. Verify Frontend Integration
- [ ] Test Story Selection page generates acceptance criteria
- [ ] Test Test Case Generation page works with integrated stories
- [ ] Check browser developer tools for any CORS or network errors

## 🐛 Troubleshooting

If you still see NOT_FOUND errors:

1. **Check Vercel Functions Logs**:
   - Go to Vercel dashboard → Functions → View logs
   - Look for any import errors or startup issues

2. **Verify Python Runtime**:
   - Ensure Python 3.12 is specified in vercel.json
   - Check if all dependencies are compatible

3. **Test Local Build**:
   ```bash
   # Test locally
   cd src/backend_py
   pip install -r requirements.txt
   python -m uvicorn server:app --reload
   ```

4. **Check File Structure**:
   - Ensure `api/index.py` exists and properly imports the app
   - Verify all Python files are included in the deployment

## 📋 API Endpoints Summary

| Endpoint | Method | Purpose | Frontend Component |
|----------|--------|---------|-------------------|
| `/api/generate` | POST | Generate acceptance criteria & test cases | StorySelectionPage.tsx, GenerateAcceptanceCriteriaPage.tsx |
| `/api/integrated-story` | POST | Generate integrated test cases for multiple stories | TestCaseGenerationPage.tsx |
| `/api/upload-jira` | POST | Upload stories to JIRA | (Various components) |
| `/api/requirement-analyser` | POST | Analyze requirements | RequirementAnalyserPage.tsx |
| `/api/get-stories` | GET | Fetch stories from JIRA | StorySelectionPage.tsx |
| `/api/jira-config` | GET/POST | JIRA configuration | Configuration components |
| `/health` | GET | Health check | (Monitoring) |
| `/config` | GET | Configuration status | (Monitoring) |
