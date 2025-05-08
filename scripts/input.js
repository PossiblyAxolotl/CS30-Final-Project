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

function buttonRun() {
  return keyIsDown(SHIFT);
}

// one-shot inputs
let previousSpace    = false;
let previousInteract = false;

function buttonJump() {
  let spacePressed = keyIsDown(32) /* SPACE */;

  let response = spacePressed && spacePressed !== previousSpace;
  previousSpace = spacePressed;

  return response;
}

function buttonInteract() {
  let interactPressed = keyIsDown(69) /* E */ || mouseIsPressed && mouseButton === LEFT /* Left click */;
  
  let response = interactPressed && interactPressed !== previousInteract;
  previousInteract = interactPressed;

  return response;
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