const { Gpio } = require('pigpio');

const doorPin = new Gpio(4, { mode: Gpio.OUTPUT }); // Use GPIO 18 for the door control

function openDoor() {
  doorPin.digitalWrite(0); // Send a pulse to open the door
  setTimeout(() => {
    doorPin.digitalWrite(1); // Turn off the pulse after 1 second
  }, 2000); // Adjust the duration of the pulse as needed
}

module.exports = {
  openDoor,
};
