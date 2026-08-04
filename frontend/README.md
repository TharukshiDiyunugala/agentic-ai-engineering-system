# Multi-Agent AI Software Engineering Team: Frontend

This directory is reserved for the React / Next.js web interface of the multi-agent system.

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

## Integration points
The frontend will communicate with the backend API via `POST http://localhost:8000/build` to submit request parameters and display the visual output of each agent's execution stage in real-time.
