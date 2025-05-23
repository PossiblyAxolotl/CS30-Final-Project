// Interactive objects
let buttons = [];

class PushButton {
  constructor(x, y, z, outTo) {
    this.x = x;
    this.y = y;
    this.z = z;
    
    this.outTo = outTo; // object to activate when pressed

    this.box = new StaticBox(x, y, z, 5, 5, 5, "red");
  }
}