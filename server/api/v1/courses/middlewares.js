const Promise = require('bluebird');
const _ = require('lodash');

const visualizationTypes = require('app-modules/constants/visualizations');
const errors = require('app-modules/errors');
const visualizations = require('app-modules/utils/visualizations');
const cacheUtil = require('app-modules/utils/cache');
const Participant = require('app-modules/models/participant');
const CourseConfig = require('app-modules/models/course-config');

function getVisualizationTypeForUser({ getGroup, getCourseId }) {
  return (req, res, next) => {
    const group = getGroup(req);
    const courseId = getCourseId(req);

    if(typeof group !== 'number') {
      return next(new errors.InvalidRequestError('Group is required'));
    }

    const defaultVisualizations = [
      visualizationTypes.NO_VISUALIZATION,
      visualizationTypes.RADAR_VISUALIZATION,
      visualizationTypes.TEXTUAL_VISUALIZATION,
    ];

    CourseConfig.findById(courseId)
      .then(courseConfig => {
        const visualizationPool = courseConfig && courseConfig.visualizations
          ? courseConfig.visualizations
          : defaultVisualizations;

        if(group < 0 || group >= visualizationPool.length) {
          return next(new errors.InvalidRequestError(`Can't map group ${group} to a visualization`));
        }

        req.visualizationType = visualizationPool[group];

        next();
      });
  }
}

function getVisualizationForUser({ getUserId, getCourseId, getAccessToken, getVisualizationType, getQuery }) {
  return (req, res, next) => {
    const userId = getUserId(req);
    const courseId = getCourseId(req);
    const accessToken = getAccessToken(req);
    const visualizationType = getVisualizationType(req);

    const { exerciseGroups, cache } = getQuery(req);

    if(!exerciseGroups || typeof exerciseGroups !== 'object' || Object.keys(exerciseGroups).length === 0) {
      return next(new errors.InvalidRequestError('Valid exercise groups are required'));
    }

    const wrapToCache = getPromise => {
      const exerciseGroupNames = Object.keys(exerciseGroups).map(_.snakeCase).join(',');
      const cacheOptions = { key: `${courseId}-${userId}-${visualizationType}-${exerciseGroupNames}`, ttl: '1h' };

      return cache === true
        ? cacheUtil.withCacheGetAndSet(getPromise, cacheOptions)
        : cacheUtil.withCacheSet(getPromise, cacheOptions);
    }

    let getData = () => Promise.resolve({});

    const visualizationQuery = { courseId, userId, accessToken, query: { exerciseGroups } };
    const hasGradeEstimate = visualizationTypes.gradeEstimateTypes.includes(visualizationType);

    if(visualizationType === visualizationTypes.NO_VISUALIZATION) {
      getData = () => Promise.resolve({});
    } else if(!hasGradeEstimate) {
      getData = () => wrapToCache(() => visualizations.getUsersProgressData(visualizationQuery));
    } else {
      let data = {};

      getData = () => wrapToCache(() => {
        return visualizations.getUsersProgressData(visualizationQuery)
          .then(progressData => {
            data = progressData;

            return visualizations.getUsersEstimatedGrade(progressData.average)
          })
          .then(estimatedGrade => Object.assign({}, data, { estimatedGrade }));
      });
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
