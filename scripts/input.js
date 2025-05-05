/* INPUT */
function buttonLeft() {
  return keyIsDown(LEFT_ARROW) || keyIsDown(65) /* A */ || keyIsDown(74) /* J */;
}

function buttonRight() {
  return keyIsDown(RIGHT_ARROW) || keyIsDown(68) /* D */ || keyIsDown(76) /* L */;
}

function buttonUp() {
  return keyIsDown(UP_ARROW) || keyIsDown(87) /* W */ || keyIsDown(73) /* I */;
}

function buttonDown() {
  return keyIsDown(DOWN_ARROW) || keyIsDown(83) /* S */ || keyIsDown(75) /* K */;
}

// Axis functions
function horizontalButtons() {
  return buttonRight() - buttonLeft();
}

function verticalButtons() {
  return buttonDown() - buttonUp();
}

// Both axes
function input() {
  return { x: horizontalButtons(), y: verticalButtons() };
}