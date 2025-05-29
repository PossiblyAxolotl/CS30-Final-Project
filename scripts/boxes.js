let boxes = [];

const BUTTON_Y_OFFSET = -40;
const BUTTON_H_SIZE = 10;
const BUTTON_RAY_AREA = 60;
const BUTTON_RAY_LENGTH = 50;
const CRATE_SIZE = 30;
const CRATE_LERP = 0.5;

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
    this.drawDebug();
  }

  draw() {
    fill(this.color);

    push();
    translate(this.x, this.y, this.z);
    scale(this.sx, this.sy, this.sz);
    box(1);
    pop();
  }

  drawDebug() {
    let closestX = clamp(player.x, this.x - this.sx / 2, this.x + this.sx / 2);
    let closestZ = clamp(player.z, this.z - this.sz / 2, this.z + this.sz / 2);
    let closestY = clamp(player.y, this.y - this.sy / 2, this.y + this.sy / 2);

    push();
    translate(closestX, closestY, closestZ);
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
    let closest = createVector(
      clamp(x, this.x - this.sx / 2, this.x + this.sx / 2), // x
      clamp(y, this.y - this.sy / 2, this.y + this.sy / 2), // y
      clamp(z, this.z - this.sz / 2, this.z + this.sz / 2)  // z
    );

    let xOverlap = Math.sign(x - sx/2 - closest.x) !== Math.sign(x + sx/2 - closest.x);
    let yOverlap = Math.sign(y - sy/2 - closest.y) !== Math.sign(y + sy/2 - closest.y);
    let zOverlap = Math.sign(z - sz/2 - closest.z) !== Math.sign(z + sz/2 - closest.z);

    return xOverlap && yOverlap && zOverlap;
  }

  isOverlappingCylinder(x, y, z, downHeight, upHeight, radius) {
    // closest point on this box to the cylinder
    let closest = createVector(
      clamp(x, this.x - this.sx / 2, this.x + this.sx / 2), // x
      clamp(y, this.y - this.sy / 2, this.y + this.sy / 2), // y
      clamp(z, this.z - this.sz / 2, this.z + this.sz / 2)  // z
    );


    let xzInline = dist(closest.x, closest.z, x, z) <= radius;
    let yInline  = y - upHeight < closest.y && y + downHeight > closest.y;

    return xzInline && yInline;
  }
}

class GrabBox extends StaticBox {
  constructor(x, y, z) {
    super(x, y, z, CRATE_SIZE, CRATE_SIZE, CRATE_SIZE, "white");

    this.dX = 0;
    this.dY = 0;
    this.dZ = 0;

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

      let doesOverlap = floor.isOverlappingBox(lx, ly, lz, this.sx, this.sy, this.sz);

      if (buttonInteract()) {
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

  // receive signals from other boxes to reset position
  signal(_value /* not used */) {
    this.x = this.spawnX;
    this.y = this.spawnY;
    this.z = this.spawnZ;
  }
}

function updateBoxes() {
  for (let box of boxes) {
    box.process();
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