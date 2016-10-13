require('app-module-path').addPath(__dirname);
require('app-modules/utils/cache');

const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

mongoose.Promise = require('bluebird');

const app = express();

const server = require('./server');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/dist', express.static(path.join(__dirname, 'dist')));

app.use(server);

module.exports = app;
