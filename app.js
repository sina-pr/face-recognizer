const faceapi = require('face-api.js');
const canvas = require('canvas');
const path = require('path');
const fs = require('fs');

const {
  faceDetectionNet,
  faceDetectionOptions,
  saveFile,
} = require('./commons');

// Load models at the start of the script
async function loadModels() {
  await faceDetectionNet.loadFromDisk('./weights');
  await faceapi.nets.faceLandmark68Net.loadFromDisk('./weights');
  await faceapi.nets.faceRecognitionNet.loadFromDisk('./weights');
}

// Function to run face recognition and measure time
async function compareImages(faceMatcher, QUERY_IMAGE, SIMILARITY_THRESHOLD) {
  const startTime = new Date().getTime(); // Record start time

  // console.time('loadReferenceImage');
  // const referenceImage = await canvas.loadImage(REFERENCE_IMAGE);
  // console.timeEnd('loadReferenceImage');

  console.time('loadQueryImage');
  const queryImage = await canvas.loadImage(QUERY_IMAGE);
  console.timeEnd('loadQueryImage');

  console.time('detectReferenceFaces');
  // const resultsRef = await faceapi
  //   .detectAllFaces(referenceImage, faceDetectionOptions)
  //   .withFaceLandmarks()
  //   .withFaceDescriptors();
  console.timeEnd('detectReferenceFaces');

  console.time('detectQueryFaces');
  const resultsQuery = await faceapi
    .detectAllFaces(queryImage, faceDetectionOptions)
    .withFaceLandmarks()
    .withFaceDescriptors();
  console.timeEnd('detectQueryFaces');

  console.time('queryDrawBoxes');
  const queryDrawBoxes = resultsQuery.map((res) => {
    const bestMatch = faceMatcher.findBestMatch(res.descriptor);
    const box = res.detection.box;
    const similarity = bestMatch.distance; // Access similarity score directly
    if (similarity < SIMILARITY_THRESHOLD) {
      console.log('Verified', similarity); // Log "verified" if similarity meets threshold
    }
    return new faceapi.draw.DrawBox(box, {
      label: bestMatch.toString(),
    });
  });
  console.timeEnd('queryDrawBoxes');

  console.time('createCanvas');
  const outQuery = faceapi.createCanvasFromMedia(queryImage);
  console.timeEnd('createCanvas');

  console.time('drawBoxes');
  queryDrawBoxes.forEach((drawBox) => drawBox.draw(outQuery));
  console.timeEnd('drawBoxes');

  console.time('saveFile');
  saveFile('queryImage.jpg', outQuery.toBuffer('image/jpeg'));
  console.timeEnd('saveFile');

  const endTime = new Date().getTime(); // Record end time
  const elapsedTime = endTime - startTime;
  console.log(`Total processing time: ${elapsedTime} ms`);
  console.log('done, saved results to out/queryImage.jpg');
}

async function run() {
  try {
    // Load models at the beginning of the script
    await loadModels();

    // Example usage:
    const REFERENCE_IMAGE = path.join(
      __dirname,
      'verified_persons',
      'cr7',
      'download.jpg'
    );
    const QUERY_IMAGE = path.join(__dirname, 'captured_images', 'image1.jpg');

    const referenceImage = await canvas.loadImage(REFERENCE_IMAGE);
    const resultsRef = await faceapi
      .detectAllFaces(referenceImage, faceDetectionOptions)
      .withFaceLandmarks()
      .withFaceDescriptors();
    const faceMatcher = new faceapi.FaceMatcher(resultsRef);
    // Run face recognition with example images
    const SIMILARITY_THRESHOLD = 0.6;
    await compareImages(faceMatcher, QUERY_IMAGE, SIMILARITY_THRESHOLD);
  } catch (error) {
    console.error('Error during execution:', error);
  }
}

// Measure execution time
const start = new Date();
run().then(() => {
  const end = new Date();
  const elapsed = end - start;
  console.log(`Total script execution time: ${elapsed} ms`);
});
