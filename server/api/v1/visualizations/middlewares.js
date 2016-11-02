const Promise = require('bluebird');
const _ = require('lodash');

const visualizationTypes = require('app-modules/constants/visualizations');
const errors = require('app-modules/errors');
const visualizations = require('app-modules/utils/visualizations');

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

    const visualizationQuery = { userId, courseId, query: { exerciseGroups } };
    const visualizationOptions = { cache };

    if(visualizationType === visualizationTypes.RADAR_VISUALIZATION) {
      getData = visualizations.getUsersProgressData(visualizationQuery, visualizationOptions);
    } else if(visualizationType === visualizationTypes.RADAR_VISUALIZATION_WITH_GRADE) {
      getData = visualizations.getUsersProgressData(visualizationQuery, visualizationOptions)
        .then(progressData => {
          return Object.assign({}, progressData, {
            estimatedGrade: visualizations.getUsersEstimatedGrade(progressData.average)
          });
        });
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
