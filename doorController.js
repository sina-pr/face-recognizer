const { Gpio } = require('pigpio');

const doorPin = new Gpio(7, { mode: Gpio.OUTPUT }); // Use GPIO 18 for the door control

function openDoor() {
  doorPin.digitalWrite(1); // Send a pulse to open the door
  setTimeout(() => {
    doorPin.digitalWrite(0); // Turn off the pulse after 1 second
  }, 1000); // Adjust the duration of the pulse as needed
}

module.exports = {
  openDoor,
};
