// First person puzzle game
// PossiblyAxolotl
// Date
//
// Extra for Experts:
// - XML level loading with weird object function stuff
// - 3D with webgl
// - Complex math -- arrow functions in mathadditions.js
// - Lots of OOP and inheritance in boxes especially

// additional files: ./scripts/input.js, ./scripts/mathadditions.js, ./scripts/player.js, ./scripts/boxes.js, ./scripts/load.js, ./scripts/logic.js
// https://github.com/camelCaseSensitive/p5-raycast

const DELTA_RATIO = 1000;

let sensitivity = 0.1;

// Camera
const NEAR_PLANE = 0.01;
const FAR_PLANE  = 5 * 800;

let cam;
let aspectRatio, cameraFOV; // defined using screen width and height in setup()

// FOV goes up when running, multiplied by fovFactor
const DEFAULT_FOVFAC = 1;
const RUN_FOVFAC     = 1.2;
const FOV_SIZE       = 800;

let fovFactor = 0;

// other important
let player;

// textures
let texLook, texInteract, texMove;

function preload() {
  texLook = loadImage("textures/look.png");
  texInteract = loadImage("textures/interact.png");
  texMove = loadImage("textures/move.png");

  loadXML("levels/tutorial.xml", loadLevelFromXML);
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  frameRate(60);

  aspectRatio = width/height;
  cameraFOV = 2 * atan(height / 2 / FOV_SIZE);

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

  if (player.y > 500) {
    reloadLevel();
  }

  firstlevelTutorials();
}

function mouseClicked() {
  requestPointerLock();
}

function firstlevelTutorials() {
  push();
  translate(0, -80, -160);
  texture(texLook);
  noStroke();
  plane(60);
  pop();

  push();
  translate(-160, -80, 0);
  rotateY(deg2rad(90));
  texture(texMove);
  noStroke();
  plane(60);
  pop();

  push();
  translate(160, -80, 0);
  rotateY(deg2rad(-90));
  texture(texInteract);
  noStroke();
  plane(60);
  pop();
}