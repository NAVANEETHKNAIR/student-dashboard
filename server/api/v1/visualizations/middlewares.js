const Promise = require('bluebird');
const _ = require('lodash');

const visualizationConstants = require('app-modules/constants/visualizations');
const errors = require('app-modules/errors');
const visualizations = require('app-modules/utils/visualizations');

function getVisualizationTypeForUser(getUserId) {
  return (req, res, next) => {
    const userId = getUserId(req);

    req.visualizationType = visualizationConstants.RADAR_VISUALIZATION;

    next();
  }
}

function getVisualizationForUser({ getUserId, getCourseId, getVisualizationType, getQuery, getOptions }) {
  return (req, res, next) => {
    const getDefaultOptions = () => ({
      cache: 'true'
    });

    const userId = getUserId(req);
    const courseId = getCourseId(req);
    const visualizationType = getVisualizationType(req);

    const { exerciseGroups } = getQuery(req);

    const options = (getOptions || getDefaultOptions)(req);

    const cache = options.cache === 'false' ? false : true;

    if(!exerciseGroups) {
      return next(new errors.InvalidRequestError('Exercise groups are required'));
    }

    visualizations.getUsersProgressData({ userId, courseId, query: { exerciseGroups } }, { cache })
      .then(visualization => {
        req.visualization = {
          type: visualizationType,
          data: visualization
        };

        next();
      })
      .catch(err => next(err));
  }
}

module.exports = { getVisualizationForUser, getVisualizationTypeForUser };
