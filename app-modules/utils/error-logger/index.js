const rollbar = require('rollbar');
const rollbarIsEnabled = process.env.ROLLBAR_ACCESS_TOKEN && process.env.ROLLBAR_ENABLED;

if(rollbarIsEnabled) {
  rollbar.init(process.env.ROLLBAR_ACCESS_TOKEN)
}

function logError(error) {
  if(rollbarIsEnabled) {
    rollbar.reportMessage(error);
  }
}

module.exports = {
  logError
};
