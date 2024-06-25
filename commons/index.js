const { canvas } = require('./env');
const { faceDetectionNet, faceDetectionOptions } = require('./faceDetection');
const { saveFile } = require('./saveFile');

module.exports = { canvas, faceDetectionNet, faceDetectionOptions, saveFile };
