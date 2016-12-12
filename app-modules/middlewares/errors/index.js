const { mapValues } = require('lodash');

const errors = require('app-modules/errors');
const logger = require('app-modules/utils/logger')('server');

function apiErrorHandler() {
  return (err, req, res, next) => {
    logger.error(err, req);
    
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

    res.status(statusCode).json({ message, properties: err.properties || properties, status: statusCode });
  }
}

module.exports = { apiErrorHandler };
