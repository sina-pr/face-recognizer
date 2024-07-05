const { Gpio } = require('pigpio');

function initializeLightController() {
  const LDRPin = new Gpio(20, { mode: Gpio.INPUT, alert: true });
  const LED = new Gpio(16, { mode: Gpio.OUTPUT });

  LDRPin.on('alert', (level) => {
    console.log(`Brightness level: ${level}`);

    if (level === 1) {
      LED.digitalWrite(1);
    } else {
      LED.digitalWrite(0);
    }
  });
}

module.exports = {
  initializeLightController,
};
