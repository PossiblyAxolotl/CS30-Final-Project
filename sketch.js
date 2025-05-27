// First person puzzle game
// PossiblyAxolotl
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

// additional files: ./scripts/input.js, ./scripts/mathadditions.js, ./scripts/player.js, ./scripts/staticbody.js
// https://github.com/camelCaseSensitive/p5-raycast

const DELTA_RATIO = 1000;

let sensitivity = 0.1;

// Camera
let cam;
let aspectRatio, cameraFOV; // defined using screen width and height in setup()
const NEAR_PLANE = 0.01;
const FAR_PLANE  = 5 * 800;

let fovFactor = 0;
const DEFAULT_FOVFAC = 1;
const RUN_FOVFAC     = 1.2;

let player = new Player(0, -800, 0);

let floor = new StaticBox(0, 50, 0, 1000, 50, 1000);
new StaticBox(550, 100, 550, 100, 100, 100);
new StaticBox(-550, 100, 550, 200, 100, 200);
new StaticBox(200, -100, -100, 100, 100, 100);
new StaticBox(0, -180, 0, 75, 50, 75);
new BoxButton(-100, 20, 0, floor);

let b = new GrabBox(0,0,0);

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  frameRate(60);

  aspectRatio = width/height;
  cameraFOV = 2 * atan(height / 2 / 800);

  cam = createCamera();

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