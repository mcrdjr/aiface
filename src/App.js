//https://blog.devgenius.io/simple-ai-face-and-emotion-recognition-with-react-da2921e6075e

import { useRef, useEffect } from 'react';
import './App.css';
import * as faceapi from "face-api.js";
import axios from 'axios';

function App() {
  const videoRef = useRef();
  const canvasRef = useRef();

  useEffect(() => {
    startVideo();
    videoRef && loadModels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  //https://stackoverflow.com/questions/60698403/cant-load-models-for-face-api-js
  //https://github.com/facebook/create-react-app/issues/11756
  //https://justadudewhohacks.github.io/face-api.js/docs/index.html#usage-loading-models



  console.log(faceapi.nets)

/* fs.access("./models", function(error) {
  if (error) {
    console.log("Directory does not exist.")
  } else {
    console.log("Directory exists.")
  }
}) */

/* const tryRequire = (path) => {
  try {
   return require(`${path}`);
  } catch (err) {
   return path + ': no path feature';
  }
};

const folder = tryRequire('/models') ? tryRequire('/models')
   : tryRequire('/models') ;
  console.log('Folder:', folder); */

  //https://stackoverflow.com/questions/50585838/how-to-check-if-asset-was-added-from-public-dir-in-react
//https://github.com/justadudewhohacks/face-api.js/issues/455
//https://stackoverflow.com/questions/50585838/how-to-check-if-asset-was-added-from-public-dir-in-react
//https://justadudewhohacks.github.io/face-api.js/docs/index.html#usage-loading-models
//https://github.com/justadudewhohacks/face-api.js



  axios.get('http://localhost:3000/models').then((response) => {
    console.log(response)
}).catch((error) => {
    console.log(error)
})


const LoadModels = async () => {
  const MODEL_URL = "/models";
  await faceapi.loadSsdMobilenetv1Model(MODEL_URL);
  await faceapi.loadFaceLandmarkModel(MODEL_URL);
  await faceapi.loadFaceRecognitionModel(MODEL_URL);
  };

  console.log('LoadModels:' + LoadModels);

    const loadModels = () => {
      Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('./models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
        faceapi.nets.faceExpressionNet.loadFromUri('./models'),
      ]).then(() => {
        console.log('loadModels loaded')
        faceDetection();
      }).catch((console.log('loadModels error')))
    };

  const startVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((currentStream) => {
        videoRef.current.srcObject = currentStream;
      })
      .catch((err) => {
        console.error(err)
      });
  }

  const faceDetection = async () => {
    setInterval(async() => {
      const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
      canvasRef.current.innerHtml = faceapi.createCanvasFromMedia(videoRef.current);
      faceapi.matchDimensions(canvasRef.current, {
        width: 940,
        height: 650,
      })

      const resized = faceapi.resizeResults(detections, {
        width: 940,
        height: 650,
      });

      faceapi.draw.drawDetections(canvasRef.current, resized)
      faceapi.draw.drawFaceLandmarks(canvasRef.current, resized)
      faceapi.draw.drawFaceExpressions(canvasRef.current, resized)

    }, 1000)
  }

  return (
    <div  className="app">
      <h1> AI FACE DETECTION</h1>
      <div className='app__video'>
        <video crossOrigin='anonymous' ref={videoRef} autoPlay ></video>
      </div>
        <canvas ref={canvasRef} width="940" height="650" className='app__canvas' />
      
    </div>
  );
}

export default App;