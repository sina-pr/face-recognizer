const faceapi = require('face-api.js');

const faceDetectionNet = faceapi.nets.ssdMobilenetv1; // or faceapi.nets.tinyFaceDetector for Tiny Face Detector

// SsdMobilenetv1Options
const minConfidence = 0.4;

// TinyFaceDetectorOptions
const inputSize = 408;
const scoreThreshold = 0.5;

function getFaceDetectorOptions(net) {
  return net === faceapi.nets.ssdMobilenetv1
    ? new faceapi.SsdMobilenetv1Options({ minConfidence })
    : new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold });
}

const faceDetectionOptions = getFaceDetectorOptions(faceDetectionNet);

module.exports = { faceDetectionNet, faceDetectionOptions };
