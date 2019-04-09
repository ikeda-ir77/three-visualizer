import * as React from "react";
import * as ReactDOM from "react-dom";
import * as THREE from "three";
// import "../css/style.scss";
import { drawSquare3d, updateSquare3d, updateSquare3dCamera } from "./square"
import { drawSquare2_3d, updateSquare2_3d, updateSquare2_3dCamera } from "./square2"

let audioElm: any;
export let camera: any, scene: any, renderer: any;
export let canvas: any, width: number, height: number;
export let source: any, processor: any, analyser: any, dataArray: any, bufferLength: number;
export let ticker = 0;
let timer: any;
let drawVisualizer: any, updateVisualizer: any, updateCamera: any;

export const animate = () => {
    ticker += 0.5;
    render();
    timer = window.requestAnimationFrame(animate);
  };

  const render = () => {
    updateVisualizer();
    updateCamera();
    renderer.render( scene, camera );
  };

  let timeoutId: any;
  const resizeCanvas = () => {
    if ( timeoutId ) return;

    timeoutId = setTimeout(() => {
      timeoutId = 0 ;

    const
      w = window.innerWidth,
      h = window.innerHeight;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(w, h);
    camera.position.z = window.innerHeight / 2;

    camera.aspect = w / h;
    camera.updateProjectionMatrix();

    }, 500);
  };


export const App: any = (props: any) => {
  let sourceMedia: any;

  const [src, setSrc] = React.useState();
  const [visual, setVisual] = React.useState("square");

  const AudioContext = window.AudioContext || window.webkitAudioContext;
  const audioCtx = new AudioContext();

  const handleSuccess = (stream?: any) => {
// audio variable
    if(!source){
      source = sourceMedia ? audioCtx.createMediaElementSource(audioElm): audioCtx.createMediaStreamSource(stream);
    }
    processor = audioCtx.createScriptProcessor(4096, 1, 1);
    if(analyser){
      analyser.disconnect();
      source.disconnect();
    }
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 4096;
    bufferLength = analyser.fftSize;
    dataArray = new Uint8Array(bufferLength);
    analyser.getByteTimeDomainData(dataArray);

    source.connect(analyser);
    analyser.connect(audioCtx.destination);


// three.js initialization
    width = canvas.width;
    height = canvas.height;
    renderer = new THREE.WebGLRenderer({
      canvas: canvas
    });
    renderer.setSize( width, height );
    
    camera = new THREE.PerspectiveCamera( 30, width / height, 0.1, 10000 );
    camera.position.set( 100, 100, 100 );
    camera.lookAt( 0, 0, 0 );

    scene = new THREE.Scene();

    const axes = new THREE.AxesHelper(25);
    scene.add(axes)
    renderer.setPixelRatio(window.devicePixelRatio);
    const bg_color = 0x000000;
    renderer.setClearColor( bg_color, 0 );
    drawVisualizer();
    animate();
  };

  const handleUpload = (ev: any) => {
    window.cancelAnimationFrame(timer);
    /*
    let fr = new FileReader();
    const url = ev.target.files[0];
    fr.readAsDataURL(ev.target.files[0]);
    fr.onload = (res: any) => {
      console.log(res.target.result)
      setSrc(fr.result);
      sourceMedia = fr.result;
      navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false
      }).then(handleSuccess);
    };
    */
    var sound = audioElm;
    sound.src = URL.createObjectURL(ev.target.files[0]);
    sourceMedia = sound.src;
    sound.onended = function() {
      URL.revokeObjectURL(this.src);
    };
    handleSuccess();
  };

  const handleClickRecords = () => {
    sourceMedia = null;
    navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false
    }).then(handleSuccess);    
  };

  const handleChange = (ev?: any) => {
    let result;
    ev ? result = ev.target.value : null;
    console.log(result)
    switch(result){
      case 'square2':
        drawVisualizer = drawSquare2_3d;
        updateVisualizer = updateSquare2_3d;
        updateCamera = updateSquare2_3dCamera;
        console.log('change')
        break;

      default:
        drawVisualizer = drawSquare3d;
        updateVisualizer = updateSquare3d;
        updateCamera = updateSquare3dCamera;
    }
    if(source){
      while(scene.children.length > 0){ 
        scene.remove(scene.children[0]); 
      }
      drawVisualizer();
    }
  };

  React.useEffect(() => {
    handleChange();
  }, []);

  return (
    <div>
      <canvas id="canvas" width="640" height="480" ref={ (elm) => { canvas = elm; } } />
      <div className="controls">
      {/*
        <button className="btn" id="record" onClick={handleClickRecords}>●</button>
      */}
        <select name="type" id="type" onChange={handleChange}>
          <option value="square">
            square
          </option>
          <option value="square2">
            square2
          </option>
        </select>
        <audio id="audio" src={src} ref={ (elm) => { audioElm = elm; } } controls />
        <input id="upload" accept="audio/*" type="file" onChange={handleUpload} />
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
export default App;