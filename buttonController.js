const Gpio = require('onoff').Gpio; // Gpio class from onoff to interact with GPIO
const button = new Gpio(533, 'in', 'both'); // Use GPIO pin 17, and configure it as an input

// Initialize the state
let isOn = false;

// Function to handle the button press
function handleButtonPress(err, value) {
  if (err) {
    console.error('There was an error', err);
    return;
  }

  // Toggle the state when button is pressed
  isOn = !isOn;

  if (isOn) {
    console.log('The button is now ON');
  } else {
    console.log('The button is now OFF');
  }
}

// Watch for changes on the button
button.watch(handleButtonPress);

// Clean up on exit
function exit() {
  button.unexport();
  process.exit();
}

process.on('SIGINT', exit);
