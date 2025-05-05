// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"


function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  debugMode();
  camera(200, -400, 800);
}

function draw() {
  background(220);

  //orbitControl();

  push();
  rotateX(millis()/1000);
  rotateY(millis()/700);
  box(50);
  pop();
}
