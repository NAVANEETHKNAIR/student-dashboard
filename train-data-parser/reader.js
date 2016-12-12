const path = require('path');
const rootPath = path.resolve(__dirname, '..');

require('app-module-path').addPath(rootPath);
require('dotenv').config({ path: path.join(rootPath, '.env') });

const async = require('async');
const mongoose = require('mongoose');
const _ = require('lodash');
const Promise = require('bluebird');
const hl = require('highland');
const byline = require('byline');
const fs = require('fs');

const visualizations = require('app-modules/utils/visualizations');
const GradeEntity = require('app-modules/models/grade-entity');

const readStream = byline(fs.createReadStream(path.join(__dirname, 'data', 'data-grades.csv')));

function getIdToGrade() {
  return new Promise((resolve, reject) => {
    hl(readStream)
      .map(line => {
        const [id, grade] = line.toString().split(',');

        return {
          id,
          grade
        };
      })
      .reduce({}, (mapper, participant) => {
        mapper[participant.id.toString()] = participant.grade;

        return mapper;
      })
      .toCallback((err, idToGrade) => {
        if(err) {
          reject(err);
        } else {
          resolve(idToGrade);
        }
      });
  });
}

function readResults() {
  getIdToGrade()
    .then(idToGrade => {
      const queue = async.queue((task, cb) => {
        task()
          .then(() => {
            cb();

            return null;
          })
          .catch(console.log);
      }, 1);

      Object.keys(idToGrade).map(id => {
        const weekInSeconds = 604800;

        const visualizationOptions = {
          userId: id,
          courseId: '145',
          accessToken: process.env.TMC_ADMIN_ACCESS_TOKEN,
          query: {
            exerciseGroups: {
              'Week 1': [1473897540 - weekInSeconds, 1473897540],
              'Week 2': [1474502340 - weekInSeconds, 1474502340],
              'Week 3': [1475107140 - weekInSeconds, 1475107140],
              'Week 4': [1475711940 - weekInSeconds, 1475711940],
              'Week 5': [1476316740 - weekInSeconds, 1476316740],
              'Week 6': [1477007940 - weekInSeconds, 1477007940]
            }
          }
        }

        const getData = () => {
          return visualizations.getUsersProgressData(visualizationOptions)
            .then(data =>  _.get(data, 'average') || null)
            .then(points => {
              console.log(points);

              if(!points) {
                return Promise.resolve();
              } else {
                const entity = new GradeEntity({
                  userId: id,
                  courseId: '145',
                  grade: idToGrade[id],
                  exercises: points.exercises,
                  earliness: points.earliness,
                  scheduling: points.scheduling,
                  starting: points.starting
                });

                return entity.save();
              }
            });
        };

        queue.push(getData);
      });
    });
}

mongoose.connect(process.env.MONGO_URI, () => {
  readResults();
});
