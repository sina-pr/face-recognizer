const Gpio = require('onoff').Gpio;
const button = new Gpio(523, 'in', 'rising', { debounceTimeout: 20 });

function setupButtonListener(runFaceRecognition) {
  button.watch((err, value) => {
    if (err) {
      console.error('Error while clicking button!', err);
      return;
    }
    console.log('Button Clicked!, running face detection function...');
    runFaceRecognition();
  });
}

function exit() {
  button.unexport();
  console.log('Button listener cleaned up, exiting...');
  process.exit(0);
}

process.on('SIGINT', exit);

module.exports = {
  setupButtonListener,
};
