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

    boxes.push(this);
  }

  // processing functions
  process() {
    this.draw();
  }

  draw() {
    fill(this.color);

    push();
    translate(this.x, this.y, this.z);
    scale(this.sx, this.sy, this.sz);
    box(1);
    pop();

    this.drawDebug();
  }

  drawDebug() {
    let closest = this.getClosest(player.x, player.y, player.z);

    push();
    translate(closest.x, closest.y, closest.z);
    sphere(2);
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

    this.spawnX = x;
    this.spawnY = y;
    this.spawnZ = z;

    this.isGrabbed = false;
  }
  
  // processing functions
  process() {
    if (!this.isGrabbed) {
      if (raycast(100, [this.x, this.y, this.z], 80) && buttonInteract()) {
        this.isGrabbed = true;
        this.doCollide = false;
      }
    }
    else {
      let positionVec = player.lookVec.copy();
      positionVec.mult(100);
      
      let lx = lerp(this.x, player.x + positionVec.x, CRATE_LERP);
      let ly = lerp(this.y, player.y + positionVec.y, CRATE_LERP);
      let lz = lerp(this.z, player.z + positionVec.z, CRATE_LERP);

      let doesOverlap = false;
      
      for (let boxID = 0; boxID < boxes.length -1; boxID++) {
        if (boxID === boxes.indexOf(this)) {
          continue;
        }
        let box = boxes[boxID];
        if (box.isOverlappingBox(player.x + positionVec.x, player.y + positionVec.y, player.z + positionVec.z, this.sx, this.sy, this.sz)) {
          doesOverlap = true;
        }
      }

      if (buttonInteract() && !this.isOverlappingPlayer(player.x, player.y, player.z, PLAYER_HEIGHT, PLAYER_FOREHEAD, PLAYER_WIDTH/2)) {
        this.isGrabbed = false;
        this.doCollide = true;
      }
      if (!doesOverlap) {
        this.x = lx;
        this.y = ly;
        this.z = lz;
      }
    }

    this.draw();
  }

  ungrabbedProcess() {

  }

  grabbedProcess() {

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

    this.dX = 0;
    this.dY = 0;
    this.dZ = 0;
  }

  process() {
    super.process();

    if (!this.isGrabbed) {
      this.dY += GRAVITY * (deltaTime / DELTA_RATIO);

      for (let boxID = 0; boxID < boxes.length -1; boxID++) {
        // don't iterate over self
        if (boxID === boxes.indexOf(this)) {
          continue;
        }
        let box = boxes[boxID];
      
        if (box.isOverlappingBox(this.x, this.y + this.dY, this.z, this.sx, this.sy, this.sz)) {
          this.y = box.y-box.sy/2-this.sy/2;
          this.dY = 0;
        }
      }

      this.x += this.dX;
      this.y += this.dY;
      this.z += this.dZ;
    }
    else {
      this.dX = 0;
      this.dY = 0;
      this.dZ = 0;

      //this.dX = player.dX;
      //this.dZ = player.dZ;
    }

  }
}

class ButtonBox extends StaticBox {
  constructor(x, y, z, outTo, stayFor) {
    super(x, y + BUTTON_Y_OFFSET, z, BUTTON_H_SIZE, -BUTTON_Y_OFFSET, BUTTON_H_SIZE, "red");

    this.stayFor = stayFor; // Undefined = toggle, 0 = permanent, +int = timer
    this.outTo = outTo; // object to activate when pressed
    this.value = false;
  }

  // processing functions
  process() {
    if (raycast(BUTTON_RAY_LENGTH, [this.x, this.y, this.z], BUTTON_RAY_AREA)) {
      this.color = "green";
      if (buttonInteract()) {
        this.pressed();
      }
    }
    else {
      this.color = "red";
    }

    this.draw();
  }

  // called when button is pressed & selected w/ raycast
  pressed() {
    // ensure it has the method
    if (typeof this.outTo.signal === "function") {
      this.value = !this.value;
      this.outTo.signal(this.value);
    }
  }
}

function updateBoxes() {
  for (let box of boxes) {
    box.process();
  }
}

class SignalSplitter {
  constructor(outTo = []) {
    this.outTo = outTo;
  }

  signal(value) {
    for (let item of outTo) {
      if (typeof item.signal === "function") {
        item.signal(item.value);
      }
    }
    }
  }
}