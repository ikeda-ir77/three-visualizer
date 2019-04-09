import * as THREE from "three";
import {camera, scene, renderer, analyser, bufferLength, dataArray, canvas, width, height, ticker } from './app';
import * as App from './app'
console.log(App)

let dot: any, line: any;
let dotGeometry = new THREE.Geometry();
dotGeometry.verticesNeedUpdate = true;
dotGeometry.elementsNeedUpdate = true;
let material = new THREE.PointsMaterial( {
  size: 1,
  sizeAttenuation: false,
  color: 0x00ff00
  });

export const drawSquare3d = () => {
  let x = -32;
  let z = -32;
  for(var i = 0; i < 64; i++) {
    for(var v = 0; v < 64; v++){
      dotGeometry.vertices.push(new THREE.Vector3( x, 0, z ) );
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
  dot = new THREE.Points(dotGeometry, material);
  scene.add(dot);
  renderer.render( scene, camera );
};

export const updateSquare3d = () => {
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
  dot.material.color.r = max / (height / 20);
  dot.material.color.g = 1 - max / (height / 20);
  dot.material.needsUpdate = true;
};

export const updateSquare3dCamera = () => {
  const deg = ticker,
  rad = deg * Math.PI / 180;
  const x = Math.cos(rad) * 100;
  const z = Math.sin(rad) * 100;
  camera.position.set( x, 100, z );
  camera.lookAt( 0, 0, 0 );
};
