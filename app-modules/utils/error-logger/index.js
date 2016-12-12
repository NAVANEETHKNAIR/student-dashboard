const rollbar = require('rollbar');
const rollbarIsEnabled = process.env.ROLLBAR_ACCESS_TOKEN && process.env.ROLLBAR_ENABLED;

if(rollbarIsEnabled) {
  rollbar.init(process.env.ROLLBAR_ACCESS_TOKEN, {
    environment: process.env.NODE_ENV
  });
}

function logError(error, request = {}) {
  if(rollbarIsEnabled) {
    rollbar.handleError(error, request);
  }
}

module.exports = {
  logError
};
