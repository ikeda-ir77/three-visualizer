import * as React from "react";
import * as ReactDOM from "react-dom";
import * as THREE from "three";
// import "../css/style.scss";

let audioElm: any;
let canvas: any;
let source: any, processor: any, analyser: any;
let timer: any;

const App: any = (props: any) => {
  let ticker = 0;
  let sourceMedia: any;

  console.log(audioElm)
  const [src, setSrc] = React.useState();

  const AudioContext = window.AudioContext || window.webkitAudioContext;
  const audioCtx = new AudioContext();
  const handleSuccess = (stream: any) => {
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
    const bufferLength = analyser.fftSize;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteTimeDomainData(dataArray);

    source.connect(analyser);
    analyser.connect(audioCtx.destination);


// three.js initialization
  console.log(canvas)
    const width = canvas.width, height = canvas.height;
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas
    });
    renderer.setSize( width, height );

    
    const camera = new THREE.PerspectiveCamera( 30, width / height, 0.1, 10000 );
    camera.position.set( 100, 100, 100 );
    camera.lookAt( 0, 0, 0 );

    const scene = new THREE.Scene();

    const axes = new THREE.AxesHelper(25);
//    scene.add(axes);

    renderer.setPixelRatio(window.devicePixelRatio);
    const bg_color = 0x000000;
    renderer.setClearColor( bg_color, 0 );

    let geometry = new THREE.Geometry();
    geometry.verticesNeedUpdate = true;
    geometry.elementsNeedUpdate = true;
    let material = new THREE.PointsMaterial( {
      size: 1,
      sizeAttenuation: false,
      color: 0xff0000
      });
    let dot: any, line: any;

    const draw3d = () => {
      let x = -32;
      let z = -32;
      for(var i = 0; i < 64; i++) {
        for(var v = 0; v < 64; v++){
          geometry.vertices.push(new THREE.Vector3( x, 0, z ) );
          x++;
          if(x >= 32){
            x = -32;
          }
        }
        z++;
        if(z >= 32){
          z = -21;
        }
      }
      dot = new THREE.Points(geometry, material);
      scene.add(dot);
      renderer.render( scene, camera );
      animate();
    };

    const update3d = () => {
//      console.log(dot)
      analyser.getByteTimeDomainData(dataArray);
      const sliceWidth = canvas.width * 1.0 / bufferLength;
      let max = 0;
      for(var i = 0; i < bufferLength; i++) {
        const index = i;
        const cy = dot.geometry.vertices[index].y;
        const y = (dataArray[i] / 128 - 1) * height / 20;
        dot.geometry.vertices[index].y = cy < y ? y : cy - .1;
        if(max < dot.geometry.vertices[index].y){
          max = dot.geometry.vertices[index].y;
        }
        dot.geometry.verticesNeedUpdate = true;
        dot.geometry.elementsNeedUpdate = true;
        dot.geometry.uvsNeedUpdate = true;
        dot.geometry.normalsNeedUpdate = true;
        dot.geometry.colorsNeedUpdate = true;
      }
      dot.material.color.g = max / (height / 20);
      dot.material.color.r = 1 - max / (height / 20);
      dot.material.needsUpdate = true;
    };

    const updateCamera = () => {
      const deg = ticker,
      rad = deg * Math.PI / 180;
      const x = Math.cos(rad) * 100;
      const z = Math.sin(rad) * 100;
      camera.position.set( x, 100, z );
      camera.lookAt( 0, 0, 0 );
    }

    const animate = () => {
      ticker++;
      render();
      timer = window.requestAnimationFrame(animate);
    }

    const render = () => {
      update3d();
//      updateCamera();
      renderer.render( scene, camera );
    }

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

    draw3d();
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
    sound.onend = function() {
      URL.revokeObjectURL(this.src);
    }
    navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false
    }).then(handleSuccess);
  }

  const handleClickRecords = () => {
    sourceMedia = null;
    navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false
    }).then(handleSuccess);    
  };

  React.useEffect(() => {

  }, []);

  return (
    <div>
      <canvas id="canvas" width="640" height="480" ref={ (elm) => { canvas = elm; } } />
      <div className="controls">
      {/*
        <button className="btn" id="record" onClick={handleClickRecords}>●</button>
      */}
        <audio id="audio" src={src} ref={ (elm) => { audioElm = elm; } } controls />
        <input id="upload" accept="audio/*" type="file" onChange={handleUpload} />
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));