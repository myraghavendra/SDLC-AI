import base64
import httpx
from typing import List, Any

class JiraClientError(Exception):
    pass

async def create_jira_story(
    jira_url: str,
    username: str,
    api_token: str,
    project_key: str,
    summary: str,
    description: str
) -> str:
    auth = base64.b64encode(f"{username}:{api_token}".encode()).decode()
    url = f"{jira_url}/rest/api/3/issue"
    data = {
        "fields": {
            "project": {"key": project_key},
            "summary": summary,
            "description": {
                "type": "doc",
                "version": 1,
                "content": [
                    {
                        "type": "paragraph",
                        "content": [
                            {
                                "text": description,
                                "type": "text"
                            }
                        ]
                    }
                ]
            },
            "issuetype": {"name": "Story"}
        }
    }
    headers = {
        "Authorization": f"Basic {auth}",
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
    async with httpx.AsyncClient() as client:
        response = await client.post(url, json=data, headers=headers)
        if 200 <= response.status_code < 300:
            json_resp = response.json()
            return json_resp.get("key", "")
        else:
            raise JiraClientError(f"Jira API responded with status {response.status_code}: {response.text}")


issuetype="Story"
async def get_jira_stories(
    jira_url: str,
    username: str,
    api_token: str,
    project_key: str
) -> List[Any]:
    auth = base64.b64encode(f"{username}:{api_token}".encode()).decode()
    url = f"{jira_url}/rest/api/3/search"
    print ("Get Stories url", url)
    jql = f"project = {project_key} AND issuetype = {issuetype} ORDER BY created DESC"
    headers = {
        "Authorization": f"Basic {auth}",
        "Accept": "application/json"
    }
    # Removed debug print statement
    # print("jql",jql)
    params = {
        "jql": jql,
        "fields": "summary,description,status,issuetype",
        "maxResults": 50
    }
    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.get(url, headers=headers, params=params)
        if 200 <= response.status_code < 300:
            json_resp = response.json()
            return json_resp.get("issues", [])
        else:
            raise JiraClientError(f"Jira API responded with status {response.status_code}: {response.text}")

async def get_all_jira_stories(
    jira_url: str,
    username: str,
    api_token: str,
    project_key: str
) -> List[Any]:
    auth = base64.b64encode(f"{username}:{api_token}".encode()).decode()
    url = f"{jira_url}/rest/api/3/search"
    jql = f"project = {project_key} AND issuetype = {issuetype} ORDER BY created DESC"
    headers = {
        "Authorization": f"Basic {auth}",
        "Accept": "application/json"
    }
    all_issues = []
    start_at = 0
    max_results = 100
    async with httpx.AsyncClient(timeout=10.0) as client:
        while True:
            params = {
                "jql": jql,
                "fields": "summary,description,status,issuetype",
                "startAt": start_at,
                "maxResults": max_results
            }
            response = await client.get(url, headers=headers, params=params)
            if 200 <= response.status_code < 300:
                json_resp = response.json()
                issues = json_resp.get("issues", [])
                all_issues.extend(issues)
                if len(issues) < max_results:
                    break
                start_at += max_results
            else:
                raise JiraClientError(f"Jira API responded with status {response.status_code}: {response.text}")
    return all_issues

async def get_jira_defects(
    jira_url: str,
    username: str,
    api_token: str,
    project_key: str
) -> List[Any]:
    auth = base64.b64encode(f"{username}:{api_token}".encode()).decode()
    url = f"{jira_url}/rest/api/3/search"
    # Common bug/defect issue types (only Bug since Defect is not available)
    jql = f"project = {project_key} AND issuetype = Bug ORDER BY created DESC"
    headers = {
        "Authorization": f"Basic {auth}",
        "Accept": "application/json"
    }
    params = {
        "jql": jql,
        "fields": "summary,description,status,issuetype,priority,created,updated,resolution",
        "maxResults": 50
    }
    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.get(url, headers=headers, params=params)
        if 200 <= response.status_code < 300:
            json_resp = response.json()
            return json_resp.get("issues", [])
        else:
            raise JiraClientError(f"Jira API responded with status {response.status_code}: {response.text}")

async def get_all_jira_defects(
    jira_url: str,
    username: str,
    api_token: str,
    project_key: str
) -> List[Any]:
    auth = base64.b64encode(f"{username}:{api_token}".encode()).decode()
    url = f"{jira_url}/rest/api/3/search"
    # Common bug/defect issue types (only Bug since Defect is not available)
    jql = f"project = {project_key} AND issuetype = Bug ORDER BY created DESC"
    headers = {
        "Authorization": f"Basic {auth}",
        "Accept": "application/json"
    }
    all_issues = []
    start_at = 0
    max_results = 100
    async with httpx.AsyncClient(timeout=10.0) as client:
        while True:
            params = {
                "jql": jql,
                "fields": "summary,description,status,issuetype,priority,created,updated,resolution",
                "startAt": start_at,
                "maxResults": max_results
            }
            response = await client.get(url, headers=headers, params=params)
            if 200 <= response.status_code < 300:
                json_resp = response.json()
                issues = json_resp.get("issues", [])
                all_issues.extend(issues)
                if len(issues) < max_results:
                    break
                start_at += max_results
            else:
                raise JiraClientError(f"Jira API responded with status {response.status_code}: {response.text}")
    return all_issues

async def get_jira_issue_description(
    jira_url: str,
    username: str,
    api_token: str,
    issue_key: str
) -> str:
    auth = base64.b64encode(f"{username}:{api_token}".encode()).decode()
    url = f"{jira_url}/rest/api/3/issue/{issue_key}"
    headers = {
        "Authorization": f"Basic {auth}",
        "Accept": "application/json"
    }
    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.get(url, headers=headers)
        if 200 <= response.status_code < 300:
            json_resp = response.json()
            # Jira description can be complex, try to extract plain text if possible
            fields = json_resp.get("fields", {})
            description_field = fields.get("description", {})
            # description might be a dict with content or a string
            if isinstance(description_field, dict):
                # Extract text from Atlassian Document Format (ADF)
                def extract_text_from_adf(node):
                    if isinstance(node, dict):
                        if node.get("type") == "text":
                            return node.get("text", "")
                        elif "content" in node:
                            return "".join(extract_text_from_adf(child) for child in node["content"])
                    elif isinstance(node, list):
                        return "".join(extract_text_from_adf(child) for child in node)
                    return ""
                return extract_text_from_adf(description_field.get("content", []))
            elif isinstance(description_field, str):
                return description_field
            else:
                return ""
        else:
            raise JiraClientError(f"Jira API responded with status {response.status_code}: {response.text}")
