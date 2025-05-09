let boxes = [];

//// add planes with plane(w, h)
//// OR quad(x1, y1, z1, x2, y2, z2, x3, y3, z3, x4, y4, z4), though it may be easier to make a plane system or ignore and keep boxes
// solid flat cubic ground
class staticBox {
  constructor(x, y, z, sx, sy, sz) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.sx = sx;
    this.sy = sy;
    this.sz = sz;

    boxes.push(this);
  }

  draw() {
    push();
    translate(this.x, this.y, this.z);
    scale(this.sx, this.sy, this.sz);
    box(1);
    pop();
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

function updateBoxes() {
  for (let box of boxes) {
    box.draw();
  }
}