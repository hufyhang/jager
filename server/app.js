'use strict';
let fs = require('fs');
let path = require('path');

let hasOwn = Object.prototype.hasOwnProperty;

const METHODS = ['get', 'post', 'put', 'delete'];
const CONFIG_FILE = require('./define.js').APP_CONFIG_FILE;

class App {
  constructor(rootPath, name, router) {
    this.name = name;
    this.path = rootPath;
    this.initialize();
    this.router = router;
  }

  initialize() {
    let configPath = path.join(this.path, CONFIG_FILE);
    this.raw = fs.readFileSync(configPath, 'utf8');
    this.raw = JSON.parse(this.raw);

    this.config = this.processRaw();

    return this.config;
  }

  processRaw() {
    let raw = this.raw;
    let o = {
      appName: this.name
    };

    let apis = raw.apis;
    if (typeof apis !== 'undefined') {
      for (let api in apis) {
        if (hasOwn.call(apis, api)) {
          apis[api].forEach(item => {
            let url = `${this.name.trim()}/${api.trim()}`;
            let method = item.method.toLowerCase();

            let response = fs.readFileSync(
              path.join(this.path, item.mock),
              'utf8'
            );

            if (method in METHODS) {
              this.router[method](url, function * (next) {
                this.body = response;
              });
            }
          });
        }
      }
    }

    return o;
  }

  getRaw() {
    return this.raw;
  }

  getRouter() {
    return this.router;
  }
}

module.exports = App;
