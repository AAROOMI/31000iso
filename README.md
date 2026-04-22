
# ISO 31000 Risk Assessment Tool

A professional risk assessment tool built with React, Firebase, and Gemini AI.

## Features
- **ISO 31000 Compliant**: Guided risk assessment process.
- **AI Consultant**: Real-time AI guidance and mitigation suggestions.
- **Local LLM Fallback**: Works offline using a built-in knowledge base for risk mitigation.
- **Cloud Persistence**: Always connected to Firebase for data storage and user profiles.
- **Interactive Matrix**: Visual risk analysis.
- **Exports**: PDF, Word, and JSON reports.

## 🐳 Docker Deployment
To run this application using Docker:

1. **Build the image**:
   ```bash
   docker build -t risk-assessment-tool .
   ```

2. **Run the container**:
   ```bash
   docker run -p 3000:3000 risk-assessment-tool
   ```
   The app will be available at `http://localhost:3000`.

## 🖥️ Desktop Version (Windows)
To build and install the desktop version:

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Build the web app**:
   ```bash
   npm run build
   ```

3. **Package for Windows**:
   ```bash
   npx electron-builder build --win
   ```
   The installer will be generated in the `dist` folder.

## 🛠️ Configuration
Ensure you have a `firebase-applet-config.json` file in the root directory with your Firebase credentials. The app uses `process.env.API_KEY` for the Gemini API.

## 🌐 Offline Mode
The app automatically detects connectivity status. If offline, it switches to the **Local LLM Fallback**, providing mitigation suggestions from its internal knowledge base without requiring an internet connection.
