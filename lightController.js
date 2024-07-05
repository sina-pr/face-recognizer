const {Gpio} = require('pigpio')


const LDRPin = new Gpio(20,{mode:Gpio.INPUT,alert:true})
const LED = new Gpio(16,{mode:Gpio.OUTPUT})


LDRPin.on("alert",(level)=>{
    if(level===1){
        console.log("light is hight")
        LED.digitalWrite(1)
    }
    else {
        console.log("light is low")
        LED.digitalWrite(0)
    }
})


