'use strict';

let koa = require('koa');
let kcors = require('kcors');
let router = require('koa-router')();

let config = require('./config.js');
const ROOT_PATH = process.argv[2] || '.';

let port = 3000;

let app = koa();

app.use(kcors()); // Allow CORS

// X-Response-Time
app.use(function *(next) {
  let start = new Date();
  yield next;
  let ms = new Date() - start;
  this.set('X-Response-Time', `${ms}ms`);
});

// Logger
app.use(function *(next) {
  console.log(`[${new Date()}] [${this.method.toUpperCase()}] ${this.url}`);
  yield next;
});

app.use(function *(next) {
  this.body = { message: 'Hello world!!!' };
});

app.listen(port);
config(ROOT_PATH);
console.log(`Jager's listening port ${port}...`);