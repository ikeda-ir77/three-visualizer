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

export const drawSquare2_3d = () => {
  for(var i = 0; i < bufferLength; i++){
    const deg = 360 * i / bufferLength;
    const rad = deg * Math.PI / 180;
    const x = Math.cos(rad) * 50;
    const z = Math.sin(rad) * 50;
    dotGeometry.vertices.push(new THREE.Vector3( x, 0, z ) );
  }

  dot = new THREE.Points(dotGeometry, material);
  scene.add(dot);
  renderer.render( scene, camera );
};

export const updateSquare2_3d = () => {
  analyser.getByteTimeDomainData(dataArray);
  let max = 0;
  for(var i = 0; i < bufferLength; i++) {
    const deg = 360 * i / bufferLength;
    const rad = deg * Math.PI / 180;
    const y = 10 * (dataArray[i] / 128 - 1);

    dot.geometry.vertices[i].y = y;

    dot.geometry.verticesNeedUpdate = true;
    dot.geometry.elementsNeedUpdate = true;
    dot.geometry.uvsNeedUpdate = true;
    dot.geometry.normalsNeedUpdate = true;
    dot.geometry.colorsNeedUpdate = true;
  }
  dot.material.needsUpdate = true;
};

export const updateSquare2_3dCamera = () => {
  const deg = ticker,
  rad = deg * Math.PI / 180;
  const x = Math.cos(rad) * 100;
  const z = Math.sin(rad) * 100;
//  camera.position.set( x, 100, z );
  camera.lookAt( 0, 0, 0 );
};
