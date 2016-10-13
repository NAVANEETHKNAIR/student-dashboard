const { pick } = require('lodash');

const Action = require('app-modules/models/action');


function createAction({ getUserId, getAttributes }) {
  return (req, res, next) => {
    const userId = getUserId(req);
    const attributes = pick(getAttributes(req), ['meta', 'createdAtAdjustedToTz', 'name', 'weekday', 'hour', 'source', 'createdAt']);

    const newAction = new Action(Object.assign({}, attributes, { userId }));

    newAction.save()
      .then(() => {
        req.newAction = newAction;

        return next();
      })
      .catch(err => next(err));
  }
}

module.exports = { createAction };
