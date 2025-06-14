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

// Music from: https://freemusicarchive.org/music/Rolemusic/The_Black_Dot

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
const FIRST_LEVEL = "levels/tutorial.xml";

let player;

// textures
let texLook, texInteract, texMove, texCursor;
let cursor;

// sounds
let sndJump, sndLand, sndClick;
let bgm;

function preload() {
  // textures
  texLook = loadImage("textures/look.png");
  texInteract = loadImage("textures/interact.png");
  texMove = loadImage("textures/move.png");
  texCursor = loadImage("textures/cursor.png");

  // sound
  soundFormats("wav", "mp3");
  sndJump = loadSound("sound/jump");
  sndLand = loadSound("sound/land");
  sndClick = loadSound("sound/click");
  
  bgm = loadSound("sound/thewhitekitty.mp3");

  // load first level
  loadXML(FIRST_LEVEL, loadLevelFromXML);
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  frameRate(60);

  // start music
  bgm.loop();
  bgm.setVolume(0.35);

  // camera params
  aspectRatio = width/height;
  cameraFOV = 2 * atan(height / 2 / FOV_SIZE);

  cam = createCamera();

  // show tutorial text
  cursor = createImg("textures/look.png", "look with mouse");
  cursor.position(width/2 - texLook.width/2, height/2 - texLook.height/2);

  // change tutorial text and change to cursor later
  window.setTimeout(() => {
    cursor.remove();
    cursor = createImg("textures/move.png", "Move with wasd");
    cursor.position(width/2 - texMove.width/2, height/2 - texMove.height/2);
  }, 5000)

  window.setTimeout(() => {
    cursor.remove();
    cursor = createImg("textures/interact.png", "interact w/ left click or E");
    cursor.position(width/2 - texInteract.width/2, height/2 - texInteract.height/2);
  }, 10000)

  window.setTimeout(() => {
    cursor.remove();
    cursor = createImg("textures/cursor.png", "");
    cursor.position(width/2 - texCursor.width/2, height/2 - texCursor.height/2);
  }, 15000)

  //strokeWeight(2);
}

function draw() {
  background(220);

  player.process();

  updateBoxes();

  if (player.y > 500) {
    reloadLevel();
  }

}

function mouseClicked() {
  requestPointerLock();
}