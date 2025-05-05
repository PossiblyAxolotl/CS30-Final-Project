// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let cameraPosition = {
  // position
  x: 200,
  y: -400,
  z: 800,
  
  // rotation
  rX: 0,
  rY: 0,
  rZ: 0,
  
  // look-at
  lX: 201,
  lY: -400,
  lZ: 800,
};

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  debugMode();
}

function draw() {
  background(220);

  //orbitControl();

  moveCamera();
  updateCamera();

  push();
  rotateX(millis()/1000);
  rotateY(millis()/700);
  box(50);
  pop();
}

function moveCamera() {
  let i = input();

  cameraPosition.z += i.y * 10;
}

function mouseMoved() {
  cameraPosition.rY += movedX;
}

/*
Create a fake point that's located wherever the camera needs to look
*/
function updateCamera() {
  let c = cameraPosition;
  camera(c.x, c.y, c.z, c.lX, c.lY, c.lZ);
}

function mouseClicked() {
  requestPointerLock();
}