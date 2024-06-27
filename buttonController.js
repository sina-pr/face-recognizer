const { Gpio } = require('onoff');

const button = new Gpio(4, 'in', 'both');

function setupButtonListener(runFaceRecognition) {
  button.watch((err, value) => {
    if (err) {
      console.error('Button error:', err);
      return;
    }
    if (value === 1) {
      console.log('Button pressed, running face recognition...');
      runFaceRecognition();
    }
  });
}

module.exports = {
  setupButtonListener,
};
