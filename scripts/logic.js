// Takes in signal and sends it to multiple other objects
class SignalLogic {
  constructor(outTo) {
    this.outTo = outTo;
  }
}
class SignalSplitter extends SignalLogic {
  signal(value) {
    for (let item of this.outTo) {
      if (typeof item.signal === "function") {
        item.signal(value);
      }
    }
  }
}

class Exit extends SignalLogic{
  signal(_value) {
    loadXML(this.outTo, loadLevelFromXML);
  }
}