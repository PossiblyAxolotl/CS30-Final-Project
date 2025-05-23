let boxes = [];

class StaticBox {
  constructor(x, y, z, sx, sy, sz, color = "white") {
    this.x = x;
    this.y = y;
    this.z = z;
    this.sx = sx;
    this.sy = sy;
    this.sz = sz;

    this.color = color;

    boxes.push(this);
  }

  draw() {
    fill(this.color);

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