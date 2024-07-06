const express = require('express');
const path = require('path');
const {
  initializeFaceRecognition,
  runFaceRecognition,
} = require('./faceRecognition');
const { setupRoutes } = require('./routes');
const { setupButtonListener } = require('./buttonController');
const { initializeLightController } = require('./lightController');

const app = express();
const port = 3000;

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// Setup routes
setupRoutes(app);

// Start the server
const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

async function initialize() {
  try {
    await initializeFaceRecognition();
    setupButtonListener(runFaceRecognition);
  } catch (error) {
    console.error('Error during initialization:', error);
    process.exit(1);
  }
}

initializeLightController();

initialize();


