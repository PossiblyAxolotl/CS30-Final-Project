// Interactive objects
let buttons = [];

class PushButton {
  constructor(x, y, z, outTo, stayFor) {
    this.x = x;
    this.y = y;
    this.z = z;

    this.stayFor = stayFor; // Undefined = toggle, 0 = permanent, +int = timer
    
    this.outTo = outTo; // object to activate when pressed

    this.box = new StaticBox(x, y-40, z, 10, 40, 10, "red");

    buttons.push(this);
  }

  process() {
    let buttonDistance = dist(player.x, player.y, player.z, this.x, this.y - 40, this.z);


    if (buttonDistance < 100 && (buttonAngle - 0.5 < deg2rad(player.rY) && buttonAngle + 0.5 > deg2rad(player.rY))) {
      this.box.color = "green";
    }
    else {
      this.box.color = "red";
    }
  }
}

function processButtons() {
  angleMode(DEGREES);
  for (let button of buttons) {
    button.process();
  }
  angleMode(RADIANS);
}