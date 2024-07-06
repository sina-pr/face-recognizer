const { turnOnRgbLed } = require('./ledController');
const faceRecognition = require('./faceRecognition');
const { openDoor } = require('./doorController');
const { buzzFor } = require('./buzzerController');

const users = [
  { username: 'user1', password: 'pass1' },
  { username: 'user2', password: 'pass2' },
];

function setupRoutes(app) {
  app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  });

  app.get('/open-door', async (req, res) => {
    try {
      if (faceRecognition.waiting) {
        turnOnRgbLed(0, 255, 0); // Turn green on
        buzzFor(500); // Buzz for 1 second
        openDoor();
        faceRecognition.waiting = false;
        res.json({ success: true });
      } else {
        res.json({
          success: false,
          message: 'No pending authorization requests.',
        });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });
}

module.exports = {
  setupRoutes,
};
