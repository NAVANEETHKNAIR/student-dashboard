const mongoose = require('mongoose');
const Promise = require('bluebird');

Promise.promisifyAll(require('mongodb'));

const mongoConfig = require('app-modules/config/mongo');

const mongoClient = Promise.promisifyAll(require('mongodb').MongoClient);

function connect() {
  return Promise.promisify(mongoose.connect, { context: mongoose })(mongoConfig.uri);
}

function disconnect() {
  return Promise.promisify(mongoose.disconnect, { context: mongoose })();
}

function clean() {
  return mongoClient.connectAsync(mongoConfig.uri)
    .then(db => {
      return db.dropDatabaseAsync()
        .then(() => db.closeAsync());
    });
}

module.exports = {
  connect,
  disconnect,
  clean
};
