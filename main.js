import * as THREE from 'three';
import './style.css'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import gsap from "gsap"
//Scene
const scene= new THREE.Scene();
// shape
const geometry= new THREE.SphereGeometry(3,64,64); //radius, segments, segments
const material= new THREE.MeshStandardMaterial({
  color: '#00ff83'
})

//Sizes 
const sizes={
  width: window.innerWidth,
  height: window.innerHeight
}

const mesh = new THREE.Mesh(geometry, material); //has materials as well as geometry
scene.add(mesh)

//light
const light = new THREE.PointLight(0xffffff,1,100)
light.position.set(0,10,10)
light.intensity= 1.25
scene.add(light)

//camera
const camera= new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100) // shouldnt go above 50 as it causes distortion
camera.position.z= 20 // moving the camera back by 20
scene.add(camera)


//renderer
const canvas = document.querySelector(".webgl")
const renderer = new THREE.WebGLRenderer({canvas})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)
renderer.setPixelRatio(2)

//controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping=true;
controls.enablePan=false;
controls.enableZoom=false;
controls.autoRotate=true;
controls.autoRotateSpeed=5;

//resize
window.addEventListener('resize', ()=>{
  sizes.width = window.innerWidth
  sizes.height= window.innerHeight
  // update camera
  camera.updateProjectionMatrix()
  camera.aspect = sizes.width / sizes.height
  renderer.setSize(sizes.width,sizes.height)
})

const loop = () =>{
  controls.update()
  renderer.render(scene, camera);
  window.requestAnimationFrame(loop)
}
loop()
//timeline magic
const t1 = gsap.timeline({ defaults: {duration: 1}})
t1.fromTo(mesh.scale, {z: 0, x:0, y: 0}, {z:1, x:1, y:1})

// mouxe animation color
let mouseDown = false;
let rgb =[]
window.addEventListener("mousedown", ()=> (mouseDown = true))
window.addEventListener("mouseup", ()=> (mouseUp = false))

window.addEventListener('mousemove', (e)=> {
  if(mouseDown){
rgb=[
  Math.round((e.pageX / sizes.width)* 255),
  Math.round((e.pageY / sizes.height)* 255), 
  150
]
let newColor= new THREE.Color(`rgb(${rgb.join(",")})`);

gsap.to(mesh.material.color,{
  r: newColor.r,
  g: newColor.g,
  b: newColor.b,
})
  }
})