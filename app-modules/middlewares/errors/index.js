const { mapValues } = require('lodash');
const debug = require('debug')('server');
const PrettyError = require('pretty-error');
const pretty = new PrettyError();
const _ = require('lodash');

const errors = require('app-modules/errors');
const errorLogger = require('app-modules/utils/error-logger');

function apiErrorHandler() {
  return (err, req, res, next) => {
    debug(pretty.render(err));

    let statusCode = 500;
    let properties = {};
    let message = err instanceof errors.ApiError
      ? err.message
      : 'Something went wrong';

    if(err instanceof errors.NotFoundError) {
      statusCode = 404;
    } else if(err instanceof errors.InvalidRequestError) {
      statusCode = 400;
    } else if(err instanceof errors.ForbiddenError) {
      statusCode = 403;
    }

    if(err.name === 'ValidationError') {
      message = 'Validation error';
      statusCode = 400;
      properties = mapValues(err.errors, value => [value.message]);
    }

    errorLogger.logError(err, {
      headers: _.omit(req.headers, ['Authorization']),
      protocol: req.protocol,
      url: req.path,
      method: req.method,
      body: req.body,
      route: req.route
    });

    res.status(statusCode).json({ message, properties: err.properties || properties, status: statusCode });
  }
}

module.exports = { apiErrorHandler };
