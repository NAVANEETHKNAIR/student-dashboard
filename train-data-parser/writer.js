const path = require('path');
const rootPath = path.resolve(__dirname, '..');

require('app-module-path').addPath(rootPath);
require('dotenv').config({ path: path.join(rootPath, '.env') });

const mongoose = require('mongoose');
const hl = require('highland');
const fs = require('fs');

const GradeEntity = require('app-modules/models/grade-entity');

function writeResults() {
  hl(GradeEntity.find().cursor())
    .map(entity => `${entity.grade},${entity.exercises},${entity.earliness},${entity.scheduling},${entity.starting}\n`)
    .pipe(fs.createWriteStream(path.join(__dirname, 'data', 'data-vectors.csv')));
}

mongoose.connect(process.env.MONGO_URI, () => {
  writeResults();
});
