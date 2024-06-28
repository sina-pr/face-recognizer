const express = require('express');
const path = require('path');
const {
  initializeFaceRecognition,
  runFaceRecognition,
} = require('./faceRecognition');
const { setupRoutes } = require('./routes');
// const { setupButtonListener, cleanup } = require('./buttonController');

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

// Initialize face recognition and button listener
async function initialize() {
  try {
    await initializeFaceRecognition(); // Load models and create face matchers
    // setupButtonListener(runFaceRecognition); // Setup button listener
    await runFaceRecognition();
  } catch (error) {
    console.error('Error during initialization:', error);
    process.exit(1); // Exit process if initialization fails
  }
}

// Initialize server and modules
initialize();

// Handle process termination (cleanup GPIO resources)
// process.on('SIGINT', () => {
//   cleanup(); // Cleanup GPIO resources
//   server.close(() => {
//     console.log('Server closed');
//     process.exit(0);
//   });
// });
