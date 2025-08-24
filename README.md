# AI Workspace

This project is an AI-powered productivity suite for software development teams. It provides tools for generating user stories, designing test cases, analyzing requirements, and visualizing project data. The frontend is built with React and Vite, and the backend supports both TypeScript/Node.js and Python microservices.

## Features

- **User Story Generator**: Instantly create detailed, agile-friendly user stories with acceptance criteria.
- **Integrated Test Designer**: Design, organize, and maintain test cases linked to requirements and user stories.
- **Requirement Analyser**: Analyze and validate project requirements for clarity, completeness, and traceability.
- **Data Analyst Agent**: Visualize project metrics, trends, and KPIs with AI-powered insights and charts.

## Project Structure

```
├── src/
│   ├── components/         # React UI components
│   ├── backend/            # Node.js backend (TypeScript/JavaScript)
│   ├── backend_py/         # Python backend microservices
│   └── ...
├── index.html              # Main HTML file
├── package.json            # Project dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite configuration
└── ...
```

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- npm
- Python 3.10+

### Install Dependencies
```powershell
npm install
```

### Start Frontend
```powershell
npm run dev
```

### Start Backend (Node.js)
```powershell
npx ts-node src/server.ts
```

### Start Backend (Python)
```powershell
python src/backend_py/server.py
```

## Environment Variables Setup

For detailed instructions on setting up environment variables for local development and production, please refer to the [ENVIRONMENT_SETUP.md](ENVIRONMENT_SETUP.md) file.

## Usage
- Access the frontend at `http://localhost:5173` (default Vite port).
- Use the feature pages to generate stories, design tests, analyze requirements, and visualize data.

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License
MIT
