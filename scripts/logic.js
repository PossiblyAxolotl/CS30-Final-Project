// Takes in signal and sends it to multiple other objects
class SignalSplitter {
  constructor(outTo = []) {
    this.outTo = outTo;
  }

  signal(value) {
    for (let item of this.outTo) {
      if (typeof item.signal === "function") {
        item.signal(value);
      }
    }
  }
}