// First person puzzle game
// PossiblyAxolotl
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

// additional files: ./scripts/input.js, ./scripts/mathadditions.js, ./scripts/player.js

const DELTA_RATIO = 1000;

let sensitivity = 0.1;

let player = new Player(0, -800, 0);

let floor = new staticBox(0, 50, 0, 500, 50, 500);

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  frameRate(60);
}

function draw() {
  background(220);

  player.process();

  push();
  translate(0,-25 + Math.sin(millis()/1000) * 7,0);
  rotateX(millis()/1000);
  rotateY(millis()/700);
  //box(50);
  torus(30, 15, 5, 3);
  pop();

  updateBoxes();
}

function mouseClicked() {
  requestPointerLock();
}