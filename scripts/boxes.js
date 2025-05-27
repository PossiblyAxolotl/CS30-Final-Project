let boxes = [];

const BUTTON_Y_OFFSET = -40;

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
    super(x, y, z, 30, 30, 30, "white");
  }
  
  process() {
    this.x = player.x + 100;
    this.y = player.y;
    this.z = player.z + 100;

    this.draw();
  }
}

function updateBoxes() {
  for (let box of boxes) {
    box.process();
  }
}

class BoxButton extends StaticBox {
  constructor(x, y, z, outTo, stayFor) {
    super(x, y + BUTTON_Y_OFFSET, z, 10, -BUTTON_Y_OFFSET, 10, "red");

    this.stayFor = stayFor; // Undefined = toggle, 0 = permanent, +int = timer
    this.outTo = outTo; // object to activate when pressed
    this.value = false;
  }

  process() {
    if (raycast(50, [this.x, this.y, this.z], 50)) {
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