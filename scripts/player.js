const WALK_SPEED  = 200;
const RUN_SPEED   = 280;
const JUMP_HEIGHT = -5;
const GRAVITY     = 9.8;

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
    this.moveWithInput();
    this.moveWithGravity();
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
    let forwards = p5.Vector.fromAngle(deg2rad(player.rY));
    let right    = p5.Vector.fromAngle(deg2rad(player.rY+90));

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

    // move player
    this.x += this.dX;
    this.z += this.dZ;
  }

  moveWithGravity() {
    // apply gravity force
    this.dY += GRAVITY * (deltaTime / DELTA_RATIO);

    // jump
    if (this.onFloor && buttonJump()) {
      this.dY = JUMP_HEIGHT;
    }

    this.y += this.dY;

    // TEMPORARY FLOOR BARRIER
    if (this.y > -100) {
      this.y = -100;
    }
  }

  displayCamera() {
    // get a vector of what direction to look from rotation
    let v = p5.Vector.fromAngles(deg2rad(this.rX), deg2rad(this.rY));

    // look from current position in the direction of the vector
    camera(this.x, this.y, this.z, this.x + v.x, this.y + v.y, this.z + v.z);
  }
}