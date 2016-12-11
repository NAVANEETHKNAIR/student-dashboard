require('app-module-path').addPath(__dirname);

const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

mongoose.Promise = require('bluebird');

const revManifest = require('./rev-manifest');
const app = express();

const server = require('./server');

const isDevelopment = process.env.NODE_ENV === 'development';

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/dist', (req, res, next) => {
  if(!isDevelopment) {
    res.set('Cache-Control', `max-age=${60 * 60 * 24 * 360}`);
  }

  next();
});

app.use('/dist', cors());
app.use('/dist', express.static(path.join(__dirname, 'dist')));

app.use((req, res, next) => {
  req.revManifest = revManifest || {};
  next();
});

app.use(server);

module.exports = app;
