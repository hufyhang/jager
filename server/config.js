'use strict';
let fs = require('fs');
let path = require('path');

let App = require('./app.js');

let isUnixHiddenPath = path => (/^[.].+/).test(path);

class Config {
  constructor(root) {
    if (typeof root !== 'string' || root.trim() === '') {
      throw new TypeError(`${root} is an invalid directory path.`);
    }

    this.root = root;
    this.dirs = [];

    this.readRoot();
  }

  readRoot() {
    let dirs = fs.readdirSync(this.root).filter(file => {
      let state = fs.statSync(path.join(this.root, file));
      return state.isDirectory() && !isUnixHiddenPath(file);
    });

    console.log(`Apps found: ${dirs}`);
    this.dirs = dirs;
    return this;
  }

  applyRouter(router) {
    this.dirs.forEach(dir => {
      let app = new App(path.join(this.root, dir), dir, router);
    });
    return router;
  }

}

module.exports = Config;
