const Promise = require('bluebird');
const _ = require('lodash');

const visualizationConstants = require('app-modules/constants/visualizations');
const errors = require('app-modules/errors');
const visualizations = require('app-modules/utils/visualizations');

const Participant = require('app-modules/models/participant');

function getVisualizationTypeForUser({ getUserId, getCourseId }) {
  return (req, res, next) => {
    const userId = getUserId(req);
    const courseId = getCourseId(req);

    req.visualizationType = [visualizationConstants.NO_VISUALIZATION, visualizationConstants.RADAR_VISUALIZATION][1];

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

    let getData = Promise.resolve({});

    if(visualizationType === visualizationConstants.RADAR_VISUALIZATION) {
      getData = visualizations.getUsersProgressData({ userId, courseId, query: { exerciseGroups } }, { cache });
    }

    getData
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
