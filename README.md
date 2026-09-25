# SUROKKHA SPECIALIST AI

Premium AI-powered healthcare navigation web application.

## Overview

The purpose of this application is to help users understand:
- The apparent urgency of a health concern
- Whether medical attention may be appropriate
- What general type of healthcare professional may be relevant
- What warning signs may require urgent evaluation
- When emergency assistance may be appropriate

This is **Module 2: AI Specialist Guide** for the future SUROKKHA AI BD Ecosystem.

## Setup Instructions

1. Ensure Node.js and npm are installed.
2. Run `npm install` to install dependencies.
3. Define `.env` with required variables based on `.env.example`:
   - `GEMINI_API_KEY`: Required for AI functionality.
   - `APP_URL`: The URL where this applet is hosted.
   - `VITE_EMERGENCY_APP_URL`: The link to Module 1 for emergency integration.

## Available Scripts

- `npm run dev`: Starts the application in development mode with HMR.
- `npm run build`: Compiles both the frontend (Vite) and backend (Express) into a single optimized output.
- `npm run start`: Runs the compiled production application.

## Tech Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, Lucide React
- **Backend:** Node.js, Express, Zod, Multer
- **AI Integration:** Google Gemini API (`@google/genai`)

## Safety and Privacy

This application provides informational healthcare navigation only. The AI is strictly instructed to NEVER diagnose, prescribe, or claim certainty. User inputs are not stored in a persistent database to prioritize privacy and confidentiality.
