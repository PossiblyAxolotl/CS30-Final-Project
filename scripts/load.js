// load XML
function loadLevelFromXML(data) {
  let namedObjects = new Map();

  let p = data.getChild("player");
  let staticboxes = data.getChildren("staticbox");
  let grabboxes = data.getChildren("grabbox");
  let gravboxes = data.getChildren("gravbox");
  let splitters = data.getChildren("splitter");
  let pushbuttons = data.getChildren("pushbutton");
  let stepbuttons = data.getChildren("stepbutton");
}