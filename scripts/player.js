const WALK_SPEED  = 200;
const RUN_SPEED   = 280;
const JUMP_HEIGHT = -5;
const GRAVITY     = 9.8;

// Player dimensions
const PLAYER_WIDTH    = 80;
const PLAYER_HEIGHT   = 100;
const PLAYER_FOREHEAD = 50; // additional height over camera for collision

const NECK_MIN_ANGLE = -179;
const NECK_MAX_ANGLE = -1;

class Player {
  constructor(x=0, y=0, z=0, rY=0, rX=-90) {
    // Position
    this.x = x;
    this.y = y;
    this.z = z;

    // Velocity
    this.dX = 0;
    this.dY = 0;
    this.dZ = 0;
    
    // Rotation
    this.rX = rX; //   up & down
    this.rY = rY; // left & right

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
  }

  moveWithGravity() {
    // apply gravity force
    this.dY += GRAVITY * (deltaTime / DELTA_RATIO);

    // jump
    if (this.onFloor && buttonJump()) {
      this.dY = JUMP_HEIGHT;
      this.onFloor = false;
    }

    this.collideWithBoxes(boxes);
  }

  move() {
    this.moveWithInput();
    this.moveWithGravity();

    // move player
    this.x += this.dX;
    this.z += this.dZ;
    this.y += this.dY;
  }

  collideWithBoxes(boxes) {
    for (let box of boxes) {
      let corners = box.getCollisionArea();

      let xInline = this.x + PLAYER_WIDTH / 2 > corners.x1 && this.x - PLAYER_WIDTH / 2 < corners.x2;
      let zInline = this.z + PLAYER_WIDTH / 2 > corners.z1 && this.z - PLAYER_WIDTH / 2 < corners.z2;
      let yInline = this.y + PLAYER_HEIGHT > corners.y1 && this.y - PLAYER_FOREHEAD < corners.y2;

      // vertical collisions
      if (xInline && zInline) {
        let pdY = this.dY; // prev. dY
        this.dY = collide1D(this.y, this.dY, corners.y1, corners.y2, PLAYER_HEIGHT, PLAYER_FOREHEAD);

        // if you were falling and you slowed down (hit the ground)
        if (pdY > 0 && this.dY < pdY) {
          this.onFloor = true;
        }
      }
      
      if (xInline && yInline) {
        this.dZ = collide1D(this.z, this.dZ, corners.z1, corners.z2, PLAYER_WIDTH, PLAYER_WIDTH);
      }

      if (yInline && zInline) {
        this.dX = collide1D(this.x, this.dX, corners.x1, corners.x2, PLAYER_WIDTH, PLAYER_WIDTH);
      }
    }
  }

  displayCamera() {
    // get a vector of what direction to look from rotation
    let v = p5.Vector.fromAngles(deg2rad(this.rX), deg2rad(this.rY));

    // look from current position in the direction of the vector
    camera(this.x, this.y, this.z, this.x + v.x, this.y + v.y, this.z + v.z);
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