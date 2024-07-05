const Gpio = require('onoff').Gpio; // Gpio class from onoff to interact with GPIO
const button = new Gpio(523, 'in', 'rising',{debounceTimeout:20}); // Use GPIO pin 17, and configure it as an input


function setupButtonListener(runFaceRecognition){
  button.watch((err,value)=>{
    if (err) {
      console.error('Error while clicking button!', err);
      return;
    }
    console.log("Button Clicked!, running face detection function...")
    runFaceRecognition()
  })
}


// Clean up on exit
function exit() {
  button.unexport();
  process.exit();
}

process.on('SIGINT', exit);

module.exports = {
  setupButtonListener
}