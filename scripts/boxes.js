let boxes = [];

const BUTTON_Y_OFFSET = -40;
const BUTTON_H_SIZE = 10;
const BUTTON_RAY_AREA = 60;
const BUTTON_RAY_LENGTH = 50;
const CRATE_SIZE = 30;

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
  }

  signal(value) {
    console.log("Box " + boxes.indexOf(this) + " got a signal of " + value);
  }

  isColliding(top, left, bottom, right, far, close) {

  }

  isCollidingCylinder(top, bottom, radius) {
    
  }

  getCollisionArea() {
    // find corner placement (something like top far left, bottom close right)
    let x1 = this.x - this.sx / 2;
    let y1 = this.y - this.sy / 2;
    let z1 = this.z - this.sz / 2;

    let x2 = this.x + this.sx / 2;
    let y2 = this.y + this.sy / 2;
    let z2 = this.z + this.sz / 2;

    return {x1, y1, z1, x2, y2, z2};
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
      
      this.x = lerp(this.x, player.x + positionVec.x, 0.5);
      this.y = lerp(this.y, player.y + positionVec.y, 0.5);
      this.z = lerp(this.z, player.z + positionVec.z, 0.5);

      if (buttonInteract()) {
        this.isGrabbed = false;
        this.doCollide = true;
      }
    }

    this.draw();
  }

  signal(_value) {
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

  pressed() {
    // ensure it has the method
    if (typeof this.outTo.signal === "function") {
      this.value = !this.value;
      this.outTo.signal(this.value);
    }
  }
}