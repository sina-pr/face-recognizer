const { Gpio } = require('pigpio');

// Define the GPIO pin number for the button
const buttonPin = 40;

// Create a new GPIO instance for the button
const button = new Gpio(buttonPin, {
  mode: Gpio.INPUT,
  pullUpDown: Gpio.PUD_UP, // Use internal pull-up resistor
  edge: Gpio.EITHER_EDGE, // Trigger on both rising and falling edges
});

// Function to setup button event listener
function setupButtonListener(runFaceRecognition) {
  button.on('interrupt', (level) => {
    if (level === 0) {
      console.log('Button pressed, running face recognition...');
      runFaceRecognition();
    }
  });
}

// Cleanup function to release GPIO resources
function cleanup() {
  button.glitchFilter(0); // Disable glitch filter
  button.disableInterrupt(); // Disable interrupts
  button.digitalWrite(1); // Set pin to high (disable pull-up/down)
  button.mode(Gpio.INPUT); // Set pin mode to input
  button.pullUpDown(Gpio.PUD_OFF); // Disable pull-up/down
  button.end(); // Release GPIO resources
}

// Export functions and constants
module.exports = {
  setupButtonListener,
  cleanup,
};
