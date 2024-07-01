const { Gpio } = require('pigpio');

const redPin = new Gpio(17, { mode: Gpio.OUTPUT });
const greenPin = new Gpio(27, { mode: Gpio.OUTPUT });
const bluePin = new Gpio(22, { mode: Gpio.OUTPUT });

function turnOnRgbLed(r, g, b) {
  redPin.pwmWrite(255 - r);
  greenPin.pwmWrite(255 - g);
  bluePin.pwmWrite(255 - b);
  setTimeout(turnOffRgbLed, 5000); // Turn off LED after 5 seconds
}

function turnOffRgbLed() {
  redPin.pwmWrite(255);
  greenPin.pwmWrite(255);
  bluePin.pwmWrite(255);
}

function blinkRgbLed(r, g, b, times) {
  let blinkCount = 0;
  const interval = setInterval(() => {
    if (blinkCount % 2 === 0) {
      turnOnRgbLed(r, g, b);
    } else {
      turnOffRgbLed();
    }
    blinkCount++;
    if (blinkCount >= times * 2) {
      clearInterval(interval);
      turnOffRgbLed();
    }
  }, 500); // Blink interval of 500ms
}

module.exports = {
  turnOnRgbLed,
  turnOffRgbLed,
  blinkRgbLed,
};
