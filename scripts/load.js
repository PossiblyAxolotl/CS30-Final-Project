// load XML
function getArrayFromXML(data, name) {
  return data.getString(name).split(",");
}

function getNumArrayFromXML(data, name) {
  return getArrayFromXML(data, name).map(item => Number(item));
}

function spawnBoxesIteratively(array, object, memory) {
  for (let item of array) {
    let spawnedItem;

    // all objects have position
    let position = getNumArrayFromXML(item, "position");

    // if it's a basic block-type thing it has a size
    if (item.hasAttribute("size")) {
      let size = getNumArrayFromXML(item, "size");

      spawnedItem = new object(position[0], position[1], position[2], size[0], size[1], size[2]);
    }
    // if it has targets, find them and spawn it with them
    else if (item.getContent("none") !== "none") {
      console.log(memory.get(item.getContent()));
      spawnedItem = new object(position[0], position[1], position[2], memory.get(item.getContent()));
    }
    // it's just a boring old physics object with no target or size
    else {
      spawnedItem = new object(position[0], position[1], position[2]);
    }

    // save for referencing when spawning more things in
    if (item.hasAttribute("name")) {
      memory.set(item.getString("name"), spawnedItem);
    }
  }
}

function spawnSplittersIteratively(splitters, memory) {
  for (let splitter of splitters) {
    let targets = [];
    for (let item of splitter.getContent().split(",")) {
      targets.push(memory.get(item));
    }

    let s = new SignalSplitter(targets);
    memory.set(splitter.getString("name"), s);
  }
}

function spawnPlayer(data) {
  // get player object
  let p = data.getChild("player");
  
  // convert params to usable numbers
  let position = getNumArrayFromXML(p, "position");
  let rotation = getNumArrayFromXML(p, "rotation");

  // create player
  player = new Player(position[0], position[1], position[2], rotation[0], rotation[1]);
}

function loadLevelFromXML(data) {
  // store objects by name for future reference
  let memory = new Map();

  // get each individual box
  let staticboxes = data.getChildren("staticbox");
  let grabboxes = data.getChildren("grabbox");
  let gravboxes = data.getChildren("gravbox");
  let splitters = data.getChildren("splitter");
  let pushbuttons = data.getChildren("pushbutton");
  let stepbuttons = data.getChildren("stepbutton");

  // spawn objects that typically recieve a signal
  spawnBoxesIteratively(staticboxes, StaticBox, memory);
  spawnBoxesIteratively(grabboxes, GrabBox, memory);
  spawnBoxesIteratively(gravboxes, PhysicsBox, memory);

  // spawn objects that pass a signal to previously spawned
  spawnSplittersIteratively(splitters, memory);

  // spawn objects that send a signal (and need the references to already exist to send to)
  spawnBoxesIteratively(pushbuttons, ButtonBox, memory);
  spawnBoxesIteratively(stepbuttons, FloorButtonBox, memory);

  // spawn player last
  spawnPlayer(data)
}