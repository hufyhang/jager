'use strict';
let fs = require('fs');
let path = require('path');

let isUnixHiddenPath = path => (/^[.].+/).test(path);

let readRoot = root => {
  if (typeof root !== 'string' || root.trim() === '') {
    throw new TypeError(`${root} is an invalid directory path.`);
  }

  let dirs = [];

  dirs = fs.readdirSync(root).filter(file => {
    let state = fs.statSync(path.join(root, file));
    return state.isDirectory() && !isUnixHiddenPath(file);
  });

  console.log(dirs);
};

module.exports = readRoot;
