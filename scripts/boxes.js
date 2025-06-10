let boxes = [];

const BUTTON_Y_OFFSET = -40;
const BUTTON_H_SIZE = 10;
const BUTTON_RAY_AREA = 60;
const BUTTON_RAY_LENGTH = 50;
const CRATE_SIZE = 30;
const CRATE_LERP = 0.5;
const CRATE_MAX_OVERLAP = 20;

class StaticBox {
  constructor(x, y, z, sx, sy, sz, color = "white") {
    this.x = x;
    this.y = y;
    this.z = z;
    this.sx = sx;
    this.sy = sy;
    this.sz = sz;

    this.color = color;

    this.doCollide = true;

    // I can just call 'new StaticBox()' and have it generated
    boxes.push(this);
  }

  // processing functions
  process() {
    this.draw();
  }

  draw() {
    if (this.doCollide) {
      fill(this.color);
    }
    else {
      noFill();
    }

    push();
    translate(this.x, this.y, this.z);
    scale(this.sx, this.sy, this.sz);
    box(1);
    pop();

    this.drawDumbCircles();
  }

  drawDebug() {
    let closest = this.getClosest(player.x, player.y, player.z);

    push();
    noFill();
    translate(closest.x, closest.y, closest.z);
    sphere(2);
    pop();
  }

  drawDumbCircles() {
    push();
    sphere(1);
    pop();
  }

  // receive signals from other boxes
  signal(value) {
    console.log("Box " + boxes.indexOf(this) + " got a signal of " + value);
  }

  // collison
  isOverlappingBox(x, y, z, sx, sy, sz) {
    // closest point on this box to the other one
    let closest = this.getClosest(x, y, z);

    let xOverlap = Math.sign(x - sx/2 - closest.x) !== Math.sign(x + sx/2 - closest.x);
    let yOverlap = Math.sign(y - sy/2 - closest.y) !== Math.sign(y + sy/2 - closest.y);
    let zOverlap = Math.sign(z - sz/2 - closest.z) !== Math.sign(z + sz/2 - closest.z);

    return xOverlap && yOverlap && zOverlap;
  }

  isOverlappingPlayer(x, y, z, downHeight, upHeight, radius) {
    // closest point on this box to the cylinder
    let closest = this.getClosest(x, y, z);

    let xzInline = dist(closest.x, closest.z, x, z) <= radius;
    let yInline  = y - upHeight < closest.y && y + downHeight > closest.y;

    return xzInline && yInline;
  }

  getClosest(x, y, z) {
    return createVector(
      clamp(x, this.x - this.sx / 2, this.x + this.sx / 2), // x
      clamp(y, this.y - this.sy / 2, this.y + this.sy / 2), // y
      clamp(z, this.z - this.sz / 2, this.z + this.sz / 2)  // z
    );
  }

  isColliding() {
    return this.doCollide;
  }
}

class GrabBox extends StaticBox {
  constructor(x, y, z) {
    super(x, y, z, CRATE_SIZE, CRATE_SIZE, CRATE_SIZE, "white");

    // allow respawning if it gets a signal
    this.spawnX = x;
    this.spawnY = y;
    this.spawnZ = z;

    this.isGrabbed = false;

    this.color = "gray";
  }
  
  // processing functions
  process() {
    if (this.isGrabbed) {
      this.grabbedProcess();
    }
    else {
      this.ungrabbedProcess();
    }

    this.draw();
  }

  // unused in this specific object
  ungrabbedProcess() {}

  grabbedProcess() {
    let positionVec = player.lookVec.copy();
    positionVec.mult(100);
    
    let lx = lerp(this.x, player.x + positionVec.x, CRATE_LERP);
    let ly = lerp(this.y, player.y + positionVec.y, CRATE_LERP);
    let lz = lerp(this.z, player.z + positionVec.z, CRATE_LERP);

    let doesOverlap = false;
    
    // check if it overlaps with any other box when it next moves
    for (let boxID = 0; boxID < boxes.length -1; boxID++) {
      // skip self
      if (boxID === boxes.indexOf(this)) {
        continue;
      }

      let box = boxes[boxID];
      if (box.isOverlappingBox(player.x + positionVec.x, player.y + positionVec.y, player.z + positionVec.z, this.sx, this.sy, this.sz) && box.doCollide) {
        doesOverlap = true;
      }
    }

    // if it doesn't overlap, move
    if (!doesOverlap) {
      this.x = lx;
      this.y = ly;
      this.z = lz;
    }
  }

  // run by the player when they press interact
  checkForGrab() {
    // if the player is looking at this, grab it and tell the player it's grabbed
    if (raycast(100, [this.x, this.y, this.z], 70)) {
      this.isGrabbed = true;
      this.doCollide = false;
      return true;
    }
    return false;
  }

  attemptRelease() {
    // ensure the player isn't inside the box, and drop if it's safe
    if (!this.isOverlappingPlayer(player.x, player.y, player.z, PLAYER_HEIGHT, PLAYER_FOREHEAD, PLAYER_WIDTH/2)) {
      this.isGrabbed = false;
      this.doCollide = true;
      player.grabbedObject = null;
    }
  }

  // receive signals from other boxes to reset position
  signal(_value /* not used */) {
    this.x = this.spawnX;
    this.y = this.spawnY;
    this.z = this.spawnZ;
  }
}

class PhysicsBox extends GrabBox {
  constructor(x, y, z) {
    super(x, y, z, CRATE_SIZE, CRATE_SIZE, CRATE_SIZE, "white");

    // define additional param for gravity
    this.dY = 0;
  }

  grabbedProcess() {
    this.dY = 0;

    super.grabbedProcess();
  }

  ungrabbedProcess() {
    this.dY += GRAVITY * (deltaTime / DELTA_RATIO);

    for (let boxID = 0; boxID < boxes.length -1; boxID++) {
      // don't iterate over self
      if (boxID === boxes.indexOf(this)) {
        continue;
      }

      let box = boxes[boxID];
    
      // collide with ground
      if (box.isOverlappingBox(this.x, this.y + this.dY, this.z, this.sx, this.sy, this.sz)) {
        // player isn't holding this
        if (box !== player.grabbedObject && box.doCollide) {
          this.y = box.y-box.sy/2-this.sy/2 - 0.1;
          this.dY = 0;
        }

      }
    }

    // apply gravity
    this.y += this.dY;
  }
}

// Button base, used for all button types
class BaseButtonBox extends StaticBox {
  constructor(x, y, z, sx, sy, sz, outTo) {
    super(x, y, z, sx, sy, sz, "red");

    this.outTo = outTo;
    this.value = false;
  }

  pressed() {
    // ensure it has the method
    if (typeof this.outTo.signal === "function") {
      this.value = !this.value;
      this.outTo.signal(this.outTo instanceof Door ? !this.value : this.value);
    }
  }
}

// active when the player presses E on it
class ButtonBox extends BaseButtonBox {
  constructor(x, y, z, outTo, stayFor) {
    super(x, y + BUTTON_Y_OFFSET, z, BUTTON_H_SIZE, -BUTTON_Y_OFFSET, BUTTON_H_SIZE, outTo);

    this.stayFor = stayFor; // Undefined = toggle, 0 = permanent, +int = timer
  }

  // processing functions
  process() {
    // change to green if player can interact
    if (raycast(BUTTON_RAY_LENGTH, [this.x, this.y, this.z], BUTTON_RAY_AREA)) {
      this.color = "green";
    }
    else {
      this.color = "red";
    }

    this.draw();
  }

  checkForPress() {
    // run by player, make sure the player is actually looking directly at it before pressing and report back
    if (raycast(BUTTON_RAY_LENGTH, [this.x, this.y, this.z], BUTTON_RAY_AREA)) {
      this.pressed();
      return true;
    }
    return false;
  }
}

// active when a box or player is touching
class FloorButtonBox extends BaseButtonBox {
  constructor(x, y, z, outTo) {
    super(x, y, z, 50, 50, 50, outTo);

    this.doCollide = false;
  }

  process() {
    let pressed = false;
    this.color = "red";

    // if either a box or the player is touching, stay on
    for (let box of boxes) {
      if (box instanceof GrabBox && this.isOverlappingBox(box.x, box.y, box.z, box.sx, box.sy, box.sz)) {
        pressed = true;
        this.color = "green";
      }
    }

    if (this.isOverlappingPlayer(player.x, player.y, player.z, PLAYER_HEIGHT, PLAYER_FOREHEAD, PLAYER_WIDTH)) {
      pressed = true;
      this.color = "green";
    }

    // if the pressed value has changed since the last frame
    if (this.value !== pressed) {
      this.pressed();
    }

    this.draw();
  }
}

class Door extends StaticBox {
  constructor(x, y, z, sx, sy, sz) {
    super(x, y, z, sx, sy, sz, "blue");
  }

  signal(value) {
    this.doCollide = value;
  }
}

function updateBoxes() {
  for (let box of boxes) {
    box.process();
  }
}

function clearBoxes() {
  boxes = [];
}