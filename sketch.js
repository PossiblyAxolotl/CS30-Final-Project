// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

class Player {
  constructor(x=0, y=0, z=0, rY=0, rX=0) {
    this.x = x;
    this.y = y;
    this.z = z;
    
    this.rX = rX;
    this.rY = rY;
  }

  process() {
    this.lookAround();
    this.displayCamera();
  }

  lookAround() {
    this.rY -= movedX * sensitivity;
    this.rX -= movedY * sensitivity;

    clamp(this.rX, -90, 90);
  }

  moveWithInput() {
    let i = input(); // scripts/input.js
  }

  displayCamera() {
    // get a vector of what direction to look from rotation
    let v = p5.Vector.fromAngles(deg2rad(this.rX),deg2rad(this.rY),1);

    // look from current position in the direction of the vector
    camera(this.x, this.y, this.z, this.x + v.x, this.y + v.y, this.z + v.z);
  }
}

let sensitivity = 0.1;

let player = new Player(100, -100, 400);

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  debugMode();
}

function draw() {
  background(220);

  player.process();

  push();
  rotateX(millis()/1000);
  rotateY(millis()/700);
  box(50);
  pop();
}

function mouseClicked() {
  requestPointerLock();
}