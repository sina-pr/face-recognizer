const { Gpio } = require('pigpio');

const buzzerPin = new Gpio(21, { mode: Gpio.OUTPUT }); // Use GPIO 18 for the buzzer

function turnOnBuzzer() {
  buzzerPin.digitalWrite(1); // Turn on buzzer
}

function turnOffBuzzer() {
  buzzerPin.digitalWrite(0); // Turn off buzzer
}

function buzzFor(duration) {
  turnOnBuzzer();
  setTimeout(turnOffBuzzer, duration); // Turn off buzzer after specified duration
}

module.exports = {
  turnOnBuzzer,
  turnOffBuzzer,
  buzzFor,
};
