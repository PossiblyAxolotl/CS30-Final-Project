const WALK_SPEED  = 200;
const RUN_SPEED   = 280;
const JUMP_HEIGHT = -5;
const GRAVITY     = 9.8;

// Player dimensions
const PLAYER_WIDTH    = 30;
const PLAYER_HEIGHT   = 100;
const PLAYER_FOREHEAD = 20; // additional height over camera for collision

// min and max angle for player to look at
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

    this.grabbedObject = null;

    this.onFloor = true;
  }

  process() {
    this.lookAround();
    this.move();
    this.displayCamera();
    this.interactWithEnvironment();
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

  // use this still https://editor.p5js.org/3802203/sketches/MlKfVV2X8
  moveAndCollide(boxes) {
    for (let box of boxes) {
      // miraculously, by remaking it in such a way that it again processes every axis individually, the code started to work again.
      let overlapAfterMoveX = box.isOverlappingPlayer(this.x + this.dX, this.y, this.z, PLAYER_HEIGHT, PLAYER_FOREHEAD, PLAYER_WIDTH/2);
      let overlapAfterMoveZ = box.isOverlappingPlayer(this.x, this.y, this.z + this.dZ, PLAYER_HEIGHT, PLAYER_FOREHEAD, PLAYER_WIDTH/2);
      
      if (overlapAfterMoveX && box.isColliding()) {
        this.dX = 0;
      }

      if (overlapAfterMoveZ && box.isColliding()) {
        this.dZ = 0;
      }

      // Y stuff
      let overlapAfterMove = box.isOverlappingPlayer(this.x + this.dX, this.y + this.dY, this.z + this.dZ, PLAYER_HEIGHT, PLAYER_FOREHEAD, PLAYER_WIDTH/2);

      if (overlapAfterMove && box.isColliding()) {
        this.onFloor = true;

        // snap to ground level
        if (this.dY > 0) {
          this.y = box.y - box.sy/2 - PLAYER_HEIGHT;
        }

        this.dY = 0;
      }
    }

    // move by velocity
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

  interactWithEnvironment() {
    if (buttonInteract()) {
      if (this.grabbedObject === null) {
        for (let box of boxes) {
          if (box instanceof ButtonBox && box.checkForPress()) {
            break;
          }
          else if (box instanceof GrabBox && box.checkForGrab()) {
            this.grabbedObject = box;
            break;
          }
        }
      }
      else {
        this.grabbedObject.attemptRelease();
      }
    }
  }
}
