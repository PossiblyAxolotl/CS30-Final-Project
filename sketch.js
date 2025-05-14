// First person puzzle game
// PossiblyAxolotl
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

// additional files: ./scripts/input.js, ./scripts/mathadditions.js, ./scripts/player.js, ./scripts/staticbody.js

// FIXME: Player is infinitely thin allowing it to fall through tiny gaps
// FIXME: Player moves independently on each axis meaning corners don't collide, prev. may assist (?)
// TODO: Don't process each axis independently, that doesn't work, player is a cylinder, etc.
// TODO: when walking into something it applies force back to keep it out (?)
// Base collisions around this test https://editor.p5js.org/3802203/sketches/MlKfVV2X8

const DELTA_RATIO = 1000;

let sensitivity = 0.1;

let player = new Player(0, -800, 0);

new staticBox(0, 50, 0, 1000, 50, 1000);
new staticBox(550, 100, 550, 100, 100, 100);
new staticBox(200, -100, -100, 100, 100, 100);
new staticBox(0, -180, 0, 75, 50, 75);

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