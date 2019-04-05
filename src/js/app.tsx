import * as React from "react";
import * as ReactDOM from "react-dom";
import * as THREE from "three";
// import "../css/style.scss";

const App: any = (props: any) => {
  let canvas: any;
  let canvasCtx: any;
  let ticker = 0;

  const handleSuccess = (stream: any) => {
// audio variable
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioCtx = new AudioContext();
    let source = audioCtx.createMediaStreamSource(stream);
    let processor = audioCtx.createScriptProcessor(1024, 1, 1);
    let analyser = audioCtx.createAnalyser();
    analyser.fftSize = 1024;
    var bufferLength = analyser.fftSize;
    var dataArray = new Uint8Array(bufferLength);
    analyser.getByteTimeDomainData(dataArray);

    source.connect(analyser);
    processor.connect(audioCtx.destination);


// three.js initialization
    const width = canvas.width, height = canvas.height;
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas
    });
    renderer.setSize( width, height );

    
    const camera = new THREE.PerspectiveCamera( 30, width / height, 0.1, 10000 );
    camera.position.set( 50, 50, 50 );
    camera.lookAt( 0, 0, 0 );

    const scene = new THREE.Scene();

    var axes = new THREE.AxesHelper(25);
    scene.add(axes);

    renderer.setPixelRatio(window.devicePixelRatio);
    const bg_color = 0x000000;
    renderer.setClearColor( bg_color, 0 );

    let geometry = new THREE.Geometry();
    geometry.verticesNeedUpdate = true;
    geometry.elementsNeedUpdate = true;
    let material = new THREE.PointsMaterial( { size: 1, sizeAttenuation: false } );
    let dot: any;
    const draw3d = () => {
      let x = -16;
      let z = -16;
      for(var i = 0; i < 32; i++) {
        for(var v = 0; v < 32; v++){
          geometry.vertices.push(new THREE.Vector3( x, 0, z ) );
          x++;
          if(x >= 16){
            x = -16;
          }
        }
        z++;
        if(z >= 16){
          z = -16;
        }
      }
      dot = new THREE.Points( geometry, material );
      scene.add( dot );
      renderer.render( scene, camera );      
      processor.onaudioprocess = (e) => {
        update3d();
      }
    }

    const update3d = () => {
      analyser.getByteTimeDomainData(dataArray);
      const sliceWidth = canvas.width * 1.0 / bufferLength;
      for(var i = 0; i < bufferLength; i++) {
        const index = i;
        const y = (dataArray[i] / 128 - 1) * height / 20;
        dot.geometry.vertices[index].y = y;
        dot.geometry.verticesNeedUpdate = true;
        dot.geometry.elementsNeedUpdate = true;
        dot.geometry.uvsNeedUpdate = true;
        dot.geometry.normalsNeedUpdate = true;
        dot.geometry.colorsNeedUpdate = true;
      }
      renderer.render( scene, camera );
    }

    draw3d();
  };

  React.useEffect(() => {
    navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false
    }).then(handleSuccess);
  }, []);

  return (
    <canvas id="canvas" width="640" height="480" ref={ (elm) => { canvas = elm; } } />
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
