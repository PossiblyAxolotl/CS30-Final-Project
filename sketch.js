// First person puzzle game
// PossiblyAxolotl
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

// additional files: ./scripts/input.js, ./scripts/mathadditions.js, ./scripts/player.js, ./scripts/staticbody.js

const DELTA_RATIO = 1000;

let sensitivity = 0.1;

let player = new Player(0, -800, 0);

let floor = new StaticBox(0, 50, 0, 1000, 50, 1000);
new StaticBox(550, 100, 550, 100, 100, 100);
new StaticBox(-550, 100, 550, 200, 100, 200);
new StaticBox(200, -100, -100, 100, 100, 100);
new StaticBox(0, -180, 0, 75, 50, 75);
new PushButton(-100, 20, 0, floor);

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  frameRate(60);

  aspectRatio = width/height;
  cameraFOV = 2 * atan(height / 2 / 800);

  //strokeWeight(2);
}

function draw() {
  background(220);

  player.process();

  push();
  colorMode(HSB);
  let c = color(millis()/100 % 255, 255 , 255);
  fill(c);
  translate(0,-25 + Math.sin(millis()/1000) * 7,200);
  rotateX(millis()/1000);
  rotateY(millis()/700);
  //box(50);
  torus(30, 15, 5, 3);
  pop();

  colorMode(RGB);

  updateBoxes();
}

function mouseClicked() {
  requestPointerLock();
}