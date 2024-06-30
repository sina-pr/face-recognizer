const { Gpio } = require('pigpio');

const redPin = new Gpio(12, { mode: Gpio.OUTPUT });
const greenPin = new Gpio(10, { mode: Gpio.OUTPUT });
const bluePin = new Gpio(8, { mode: Gpio.OUTPUT });

function turnOnRgbLed(r, g, b) {
  redPin.pwmWrite(r);
  greenPin.pwmWrite(g);
  bluePin.pwmWrite(b);
  setTimeout(turnOffRgbLed, 3000); // Turn off LED after 3 seconds
}

function turnOffRgbLed() {
  redPin.pwmWrite(0);
  greenPin.pwmWrite(0);
  bluePin.pwmWrite(0);
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
