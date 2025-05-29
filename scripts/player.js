const WALK_SPEED  = 200;
const RUN_SPEED   = 280;
const JUMP_HEIGHT = -5;
const GRAVITY     = 9.8;

// Player dimensions
const PLAYER_WIDTH    = 30;
const PLAYER_HEIGHT   = 100;
const PLAYER_FOREHEAD = 20; // additional height over camera for collision

const NECK_MIN_ANGLE = -179;
const NECK_MAX_ANGLE = -1;

class Player {
  constructor(x=0, y=0, z=0, rY=0, rX=-90) {
    // Position
    this.x = x;
    this.y = y;
    this.z = z;
    this.position ;

    // Velocity
    this.dX = 0;
    this.dY = 0;
    this.dZ = 0;
    
    // Rotation
    this.rX = rX; //   up & down
    this.rY = rY; // left & right

    this.lookVec;

    this.onFloor = true;
  }

  process() {
    this.lookAround();
    this.move();
    this.displayCamera();
  }

  lookAround() {
    // look around
    this.rY -= movedX * sensitivity;
    this.rX -= movedY * sensitivity;

    // clamp vertical movement as to not snap neck
    this.rX = clamp(this.rX, NECK_MIN_ANGLE, NECK_MAX_ANGLE);

    this.rY = this.rY % 360;
  }

  moveWithInput() {
    let i = input(); // scripts/input.js
    
    // consider relative X and Z movement separately at first
    let forwards = p5.Vector.fromAngle(deg2rad(this.rY));
    let right    = p5.Vector.fromAngle(deg2rad(this.rY+90));

    forwards.mult(i.y); // y = W/S =  fwd/back
    right.mult(i.x);    // x = A/D = left/right

    // sum of vectors
    let movementVector = p5.Vector.add(forwards, right);

    // change everything to values from -1 to 1, and then multiply by walk/run speed depending on if shift is pressed
    movementVector.normalize().mult((buttonRun() ? RUN_SPEED : WALK_SPEED) * (deltaTime / DELTA_RATIO)); 

    // smooth velocity
    this.dX = lerp(this.dX, movementVector.y, 0.2);
    this.dZ = lerp(this.dZ, movementVector.x, 0.2);

    // set dX & dY to 0 if they're too small
    this.dX = trimSmall(this.dX);
    this.dZ = trimSmall(this.dZ);

    if (dist(this.dX, this.dZ, 0, 0) > 2) {
      fovFactor = lerp(fovFactor, buttonRun() ? RUN_FOVFAC : DEFAULT_FOVFAC, 0.1);
    } 
    else {
      fovFactor = lerp(fovFactor, 1, 0.1);
    }
  }

  moveWithGravity() {
    // apply gravity force
    this.dY += GRAVITY * (deltaTime / DELTA_RATIO);

    // jump
    if (this.onFloor && buttonJump()) {
      this.dY = JUMP_HEIGHT;
      this.onFloor = false;
    }
  }

  move() {
    this.moveWithInput();
    this.moveWithGravity();

    this.moveAndCollide(boxes);
  }

  // collision based on this test https://editor.p5js.org/3802203/sketches/MlKfVV2X8
  moveAndCollide(boxes) {
    for (let box of boxes) {
      if (box.isOverlappingCylinder(this.x + this.dX, this.y + this.dY, this.z + this.dZ, PLAYER_HEIGHT, PLAYER_WIDTH/2)) {
        this.dX = 0;
        this.dY = 0;
        this.dZ = 0;

        console.log("OVERLAP");

        this.onFloor = true;
      }
    }

    this.x += this.dX;
    this.y += this.dY;
    this.z += this.dZ;
  }

  displayCamera() {
    // get a vector of what direction to look from rotation
    this.lookVec = p5.Vector.fromAngles(deg2rad(this.rX), deg2rad(this.rY));

    // look from current position in the direction of the vector
    //let c = camera(this.x, this.y, this.z, this.x + this.lookVec.x, this.y + this.lookVec.y, this.z + this.lookVec.z);
    cam.setPosition(this.x, this.y, this.z);
    cam.lookAt(this.x + this.lookVec.x, this.y + this.lookVec.y, this.z + this.lookVec.z);

    cam.perspective(
      cameraFOV * fovFactor,
      aspectRatio,
      NEAR_PLANE,
      FAR_PLANE
    );
  }
}

// Modified from interactive scene project
function collide1D(position, velocity, barrier, end = null, downReach = 0, upReach = 0) {
  // before -> after
  if (velocity > 0 && position + downReach <= barrier) {
    return position + velocity + downReach > barrier ? barrier - position - downReach : velocity;
  } 
  // after -> before
  else if (end !== null && velocity < 0 && position >= end) {
    return position + velocity - upReach < end ? end - position + upReach : velocity; 
  }
  
  return velocity;
}