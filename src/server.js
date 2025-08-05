"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const axios_1 = __importDefault(require("axios"));
const openai_1 = __importDefault(require("openai"));
dotenv_1.default.config();
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY
});
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// OpenAI API endpoint for generating acceptance criteria
app.post('/api/generate', async (req, res) => {
    try {
        const { description, context } = req.body;
        if (!description) {
            return res.status(400).json({ error: 'Description is required' });
        }
        // Build the prompt using description and context
        const prompt = `Please create a user story and acceptance criteria for the following description:
    
Description: ${description}
${context ? `Additional Context: ${context}` : ''}

Please provide:
1. A user story in the format "As a [user], I want [goal] so that [benefit]"
2. Detailed acceptance criteria in the format:
   - Given [context]
   - When [action]
   - Then [result]
3. Any technical considerations or implementation notes`;
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant that generates user stories and acceptance criteria for software development tasks."
                },
                {
                    role: "user",
                    content: prompt.toString()
                }
            ],
            temperature: 0.7,
            max_tokens: 1000
        });
        const generatedText = completion.choices[0]?.message?.content;
        if (!generatedText) {
            throw new Error('No response from OpenAI');
        }
        res.json({
            success: true,
            generatedText
        });
    }
    catch (error) {
        console.error('Error generating content:', error);
        res.status(500).json({
            error: 'Failed to generate content',
            details: error.message
        });
    }
});
// Jira API endpoint
app.post('/api/upload-jira', async (req, res) => {
    const logMessages = [];
    try {
        console.log('Received request body:', req.body);
        const { summary, description } = req.body;
        logMessages.push("✅ /api/upload-jira called");
        logMessages.push("📦 Received body: " + JSON.stringify(req.body));
        const jiraUrl = process.env.JIRA_URL;
        const jiraUser = process.env.JIRA_USER;
        const jiraApiToken = process.env.JIRA_API_TOKEN;
        const jiraProjectKey = process.env.JIRA_PROJECT_KEY;
        if (!jiraUrl || !jiraUser || !jiraApiToken || !jiraProjectKey) {
            return res.status(500).json({ error: 'Missing Jira configuration' });
        }
        // Build minimal payload
        const jiraPayload = {
            fields: {
                project: { key: jiraProjectKey },
                summary: summary,
                description: description,
                issuetype: { name: 'Story' }
            }
        };
        logMessages.push('➡️ Payload sent to Jira: ' + JSON.stringify(jiraPayload));
        let response;
        try {
            response = await axios_1.default.post(`${jiraUrl}/rest/api/2/issue`, jiraPayload, {
                auth: {
                    username: jiraUser,
                    password: jiraApiToken
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
        catch (jiraError) {
            logMessages.push('❌ Jira error response: ' + JSON.stringify(jiraError?.response?.data || jiraError.message));
            console.error('Error creating Jira ticket:', jiraError?.response?.data || jiraError.message);
            return res.status(500).json({
                error: 'Failed to create Jira ticket',
                details: jiraError?.response?.data || jiraError.message,
                logs: logMessages
            });
        }
        res.json({
            success: true,
            ticketNumber: response.data.key,
            message: `Jira ticket ${response.data.key} created successfully`,
            logs: logMessages
        });
    }
    catch (error) {
        logMessages.push('❌ Server error: ' + (error.message || error));
        console.error('Error creating Jira ticket:', error);
        res.status(500).json({
            error: 'Failed to create Jira ticket',
            details: error.message,
            logs: logMessages
        });
    }
});
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
