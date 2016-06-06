export default class CompoundHandler {
  constructor(handlers = {}) {
    this.handlers = handlers;
  }
  
  onopentag(name, attributes) {
    for (let handler in this.handlers) {
      this.handlers[handler].onopentag(name, attributes);
    }
  }
  
  ontext(text) {
    for (let handler in this.handlers) {
      this.handlers[handler].ontext(text);
    }
  }
  
  onclosetag() {
    for (let handler in this.handlers) {
      this.handlers[handler].onclosetag();
    }
  }
  
  getResult() {
    let result = {};
    for (let handler in this.handlers) {
      result[handler] = this.handlers[handler].getResult();
    }
    
    return result;
  }
}
