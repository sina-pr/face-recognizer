const faceapi = require('face-api.js');
const canvas = require('canvas');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const { turnOnRgbLed, blinkRgbLed, turnOffRgbLed } = require('./ledController');
const {
  faceDetectionNet,
  faceDetectionOptions,
  saveFile,
} = require('./commons');
const { turnOnBuzzer, buzzFor } = require('./buzzerController');

const categories = {
  whitelist: [],
  blacklist: [],
  greylist: [],
};

let waiting = true;
let faceMatchers = []; // Store face matchers here

async function loadModels() {
  console.log('Loading face detection models...');
  await faceDetectionNet.loadFromDisk('./weights');
  await faceapi.nets.faceLandmark68Net.loadFromDisk('./weights');
  await faceapi.nets.faceRecognitionNet.loadFromDisk('./weights');
  console.log('Face detection models loaded successfully.');
}

async function captureImage() {
  return new Promise((resolve, reject) => {
    const QUERY_IMAGE = path.join(__dirname, 'captured_images', 'image.jpg');
    // const command = `libcamera-still -o ${QUERY_IMAGE}`;
    // exec(command, (error, stdout, stderr) => {
    //   if (error) {
    //     reject(`Error taking photo: ${error.message}`);
    //     return;
    //   }
    //   if (stderr) {
    //     reject(`libcamera-still error: ${stderr}`);
    //     return;
    //   }
    //   console.log('Photo taken successfully:', stdout);
    //   resolve(QUERY_IMAGE);
    // });
    resolve(QUERY_IMAGE);
  });
}

async function compareImages(QUERY_IMAGE, SIMILARITY_THRESHOLD) {
  console.log('Comparing captured image with reference images...');
  const queryImage = await canvas.loadImage(QUERY_IMAGE);

  const resultsQuery = await faceapi
    .detectAllFaces(queryImage)
    .withFaceLandmarks()
    .withFaceDescriptors();

  for (const res of resultsQuery) {
    for (const refMatch of faceMatchers) {
      const bestMatch = refMatch.faceMatcher.findBestMatch(res.descriptor);
      const similarity = bestMatch.distance;
      if (similarity < SIMILARITY_THRESHOLD) {
        console.log(`Verified with similarity ${similarity}: ${refMatch.name}`);
        handleAccess(refMatch.name);
        return;
      }
    }
  }
  console.log('No match found in reference images.');
  denyAccess();
}

function handleAccess(name) {
  if (categories.blacklist.includes(name)) {
    console.log(`Access Denied: ${name} is on the blacklist.`);
    blinkRgbLed(255, 0, 0, 2); // Blink red
    buzzFor(2000); // Buzz for 2 seconds
  } else if (categories.whitelist.includes(name)) {
    console.log(`Access Granted: ${name} is on the whitelist.`);
    turnOnRgbLed(0, 255, 0); // Turn green on
    buzzFor(1000); // Buzz for 1 second
  } else if (categories.greylist.includes(name)) {
    console.log(`Greylist - Waiting for request for ${name}.`);
    waiting = true;
    turnOnRgbLed(255, 255, 0); // Turn yellow on
    buzzFor(1000); // Buzz for 1 second
    setTimeout(() => {
      console.log('Request timeout - Access Denied');
      waiting = false;
      turnOffRgbLed();
      blinkRgbLed(255, 0, 0, 2); // Blink red
      buzzFor(2000); // Buzz for 2 seconds
    }, 30000); // 30 seconds to send a request
  } else {
    console.log(`Person not categorized: ${name}`);
  }
}

function denyAccess() {
  console.log('Access Denied: No match found.');
  turnOnRgbLed(255, 0, 0); // Turn red on
  buzzFor(2000); // Buzz for 2 seconds
}

async function createFaceMatchers() {
  const referenceImagesDir = path.join(__dirname, 'verified_persons');
  const files = fs.readdirSync(referenceImagesDir);

  for (const file of files) {
    const referenceImagePath = path.join(referenceImagesDir, file);
    const referenceImage = await canvas.loadImage(referenceImagePath);
    const resultsRef = await faceapi
      .detectAllFaces(referenceImage)
      .withFaceLandmarks()
      .withFaceDescriptors();

    if (resultsRef.length > 0) {
      const faceMatcher = new faceapi.FaceMatcher(resultsRef);
      const [person, category] = file.split('.');
      if (category && categories[category]) {
        categories[category].push(person);
      }
      faceMatchers.push({
        name: person,
        faceMatcher,
      });
      console.log(`Reference image processed: ${file}`);
    }
  }
}

async function initializeFaceRecognition() {
  console.log('Initializing face recognition system...');
  await loadModels();
  await createFaceMatchers();
  await runFaceRecognition();
  console.log('Face recognition system initialized successfully.');
}

async function runFaceRecognition() {
  try {
    console.log('Running face recognition process...');
    const QUERY_IMAGE = await captureImage();
    const SIMILARITY_THRESHOLD = 0.6;
    await compareImages(QUERY_IMAGE, SIMILARITY_THRESHOLD);
  } catch (error) {
    console.error('Error during face recognition process:', error);
  }
}

module.exports = {
  runFaceRecognition,
  initializeFaceRecognition,
  waiting,
};
