// First person puzzle game
// PossiblyAxolotl
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

// additional files: ./scripts/input.js, ./scripts/mathadditions.js, ./scripts/player.js

const DELTA_RATIO = 1000;

let sensitivity = 0.1;

let player = new Player(0, -100, 0);

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  frameRate(60);
}

function draw() {
  background(220);

  player.process();

  push();
  translate(0,-25,0);
  rotateX(millis()/1000);
  rotateY(millis()/700);
  box(50);
  pop();

  push();
  scale(10,1,10);
  translate(0,50,0);
  fill("gray");
  box(50);
  pop();
}

function mouseClicked() {
  requestPointerLock();
}