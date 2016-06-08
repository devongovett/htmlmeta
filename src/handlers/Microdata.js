import Handler from './Handler';
import {add} from '../utils';

export default class Microdata extends Handler {
  constructor() {
    super();
    this.microdataStack = [];
    this.result = null;
  }
  
  anyStart(name, attributes) {    
    if (attributes.itemscope != null) {
      let item = Object.create(null);
      
      if (attributes.itemtype) {
        item['@type'] = attributes.itemtype;
      }
      
      if (this.microdataStack.length && attributes.itemprop) {
        add(this.microdataStack[this.microdataStack.length - 1], attributes.itemprop, item);
      }
      
      this.microdataStack.push(item);
    }
  }
  
  any(name, attributes, text) {
    if (attributes.itemscope != null && this.microdataStack.length) {
      let item = this.microdataStack.pop();
      if (this.microdataStack.length === 0) {
        add(this, 'result', item)
      }
      
      return;
    }
    
    if (attributes.itemprop && this.microdataStack.length) {
      let item = this.microdataStack[this.microdataStack.length - 1];
      let value = attributes.src || attributes.href || attributes.content || attributes.datetime || text;
      
      add(item, attributes.itemprop, value);
    }
  }
}