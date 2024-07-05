const { Gpio } = require('pigpio');

const doorPin = new Gpio(14, { mode: Gpio.OUTPUT });

function openDoor() {
  doorPin.digitalWrite(0);
  setTimeout(() => {
    doorPin.digitalWrite(1);
  }, 2000);
}

module.exports = {
  openDoor,
};
