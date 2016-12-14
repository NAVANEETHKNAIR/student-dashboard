const Cacheman = require('cacheman');
const Promise = require('bluebird');
const EngineMongo = require('cacheman-mongo');

const mongoCacheOptions = {
  collection: 'tmcCache',
};

let cache;

function connect(uri) {
  cache = new Cacheman('tmc', {
    engine: new EngineMongo(uri, mongoCacheOptions),
    promise: Promise
  });
}

function get(key) {
  return cache.get(key);
}

function set(key, value, { ttl = '1d' } = {}) {
  return cache.set(key, value, ttl);
}

function del(key) {
  return cache.del(key);
}

function withCacheSet(getPromise, { key, ttl } =  {}) {
  return getPromise()
    .then(cacheData => {
      return set(key, cacheData, { ttl })
        .then(() => cacheData);
    });
}

function withCacheGetAndSet(getPromise, { key, ttl } = {}) {
  return get(key)
    .then(cacheData => {
      if(!cacheData) {
        return getPromise()
          .then(data => {
            set(key, data);

            return data;
          });
      } else {
        return cacheData;
      }
    });
}

module.exports = {
  connect,
  get,
  set,
  del,
  withCacheSet,
  withCacheGetAndSet
};
