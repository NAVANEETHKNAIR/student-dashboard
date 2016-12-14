let uri = null;

if(process.env.MONGO_URI) {
  uri = process.env.MONGO_URI;
} else if(process.env.MONGO_PORT_2017_TCP_ADDR && process.env.MONGO_DB) {
  uri = `mongodb://${process.env.MONGO_PORT_2017_TCP_ADDR}/${process.env.MONGO_DB}`;
} else {
  throw new Error('Couldn\'t get MongoDB URI config');
}

module.exports = {
  uri
};
