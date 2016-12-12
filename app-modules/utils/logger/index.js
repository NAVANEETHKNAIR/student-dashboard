const makeDebug = require('debug');
const rollbar = require('rollbar');
const _ = require('lodash');
const PrettyError = require('pretty-error');

const pretty = new PrettyError();

const rollbarIsEnabled = process.env.ROLLBAR_ACCESS_TOKEN && process.env.ROLLBAR_ENABLED;

if(rollbarIsEnabled) {
  rollbar.init(process.env.ROLLBAR_ACCESS_TOKEN, {
    environment: process.env.NODE_ENV
  });
}

function rollbarRequestFromRequest(req) {
  return {
    headers: _.omit(req.headers, ['Authorization']),
    protocol: req.protocol,
    url: req.path,
    method: req.method,
    body: req.body,
    route: req.route
  };
}

function makeLogger(namespace) {
  const debug = makeDebug(namespace);

  return {
    error: (error, request = {}) => {
      const formattedRequest = request.app
        ? rollbarRequestFromRequest(request)
        : request;

      if(rollbarIsEnabled) {
        rollbar.handleError(error, formattedRequest);
      }

      const renderer = process.env.NODE_ENV === 'development'
        ? err => pretty.render(err)
        : err => err;

      debug(renderer(error));
    },
    info: message => debug(message)
  }
}

module.exports = makeLogger;
