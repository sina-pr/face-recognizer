const express = require('express');
const path = require('path');
const {
  runFaceRecognition,
  initializeFaceRecognition,
} = require('./faceRecognition');
const { setupRoutes } = require('./routes');
const { setupButtonListener } = require('./buttonController');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

setupRoutes(app);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

async function initialize() {
  try {
    await initializeFaceRecognition();
    setupButtonListener(runFaceRecognition);
  } catch (error) {
    console.error('Error during initialization:', error);
  }
}

initialize();
