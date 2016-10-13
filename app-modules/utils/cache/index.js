const Cacheman = require('cacheman');
const Promise = require('bluebird');
const EngineMongo = require('cacheman-mongo');

const mongoCacheOptions = {
  collection: 'tmcCache',
};

const cache = new Cacheman('tmc', {
  engine: new EngineMongo(process.env.MONGO_URI, mongoCacheOptions),
  promise: Promise
});

function get(key) {
  return cache.get(key);
}

function set(key, value, { ttl = '1d' } = {}) {
  return cache.set(key, value, ttl);
}

function del(key) {
  return cache.del(key);
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

module.exports = { get, set, del, withCacheGetAndSet };
