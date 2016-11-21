const Promise = require('bluebird');
const _ = require('lodash');

const visualizationTypes = require('app-modules/constants/visualizations');
const errors = require('app-modules/errors');
const visualizations = require('app-modules/utils/visualizations');
const cacheUtil = require('app-modules/utils/cache');
const Participant = require('app-modules/models/participant');

function getVisualizationTypeForUser(getGroup) {
  return (req, res, next) => {
    let group = getGroup(req);

    if(!group) {
      return next(new errors.InvalidRequestError('Group is required'));
    }

    group = +group;

    if(group >= Object.keys(visualizationTypes).length) {
      return next(new errors.InvalidRequestError(`Can't map group ${group} to a visualization`));
    }

    req.visualizationType = [
      visualizationTypes.NO_VISUALIZATION,
      visualizationTypes.RADAR_VISUALIZATION,
      visualizationTypes.RADAR_VISUALIZATION_WITH_GRADE
    ][group];

    return next();
  }
}

function getVisualizationForUser({ getUserId, getCourseId, getAccessToken, getVisualizationType, getQuery }) {
  return (req, res, next) => {
    const userId = getUserId(req);
    const courseId = getCourseId(req);
    const accessToken = getAccessToken(req);
    const visualizationType = getVisualizationType(req);

    const { exerciseGroups, cache } = getQuery(req);

    if(!exerciseGroups) {
      return next(new errors.InvalidRequestError('Exercise groups are required'));
    }

    const wrapToCache = promise => {
      const cacheOptions = { key: `visualization-${courseId}-${userId}`, ttl: '2h' };

      return cache === true
        ? cacheUtil.withCacheGetAndSet(() => promise, cacheOptions)
        : cacheUtil.withCacheSet(() => promise, cacheOptions);
    }

    let getData = () => wrapToCache(Promise.resolve({}));

    const visualizationQuery = { courseId, userId, accessToken, query: { exerciseGroups } };

    if(visualizationType === visualizationTypes.RADAR_VISUALIZATION) {
      getData = () => wrapToCache(visualizations.getUsersProgressData(visualizationQuery));
    } else if(visualizationType === visualizationTypes.RADAR_VISUALIZATION_WITH_GRADE) {
      let data = {};

      getData = () => {
        const promise = visualizations.getUsersProgressData(visualizationQuery)
          .then(progressData => {
            data = progressData;

            return visualizations.getUsersEstimatedGrade(progressData)
          })
          .then(estimatedGrade => Object.assign({}, data, { estimatedGrade }));

        return wrapToCache(promise);
      };
    }

    getData()
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
