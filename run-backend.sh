#!/bin/bash
# Script to run backend server with ts-node

# Check if ts-node is installed, install if not
if ! command -v ts-node &> /dev/null
then
    echo "ts-node not found, installing..."
    npm install -g ts-node typescript
fi

# Run the backend server
ts-node src/backend/server.ts
