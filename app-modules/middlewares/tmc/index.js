const errors = require('app-modules/errors');
const tmcApi = require('app-modules/utils/tmc-api');

function getProfile(getAccessToken) {
  return (req, res, next) => {
    const defaultGetAccessToken = req => (req.headers['authorization'] || '').split(' ')[1];

    const accessToken = (getAccessToken || defaultGetAccessToken)(req);

    if(!accessToken) {
      return next(new errors.InvalidRequestError('Access token is required'));
    }

    tmcApi.getProfile(accessToken)
      .then(profile => {
        req.tmcProfile = Object.assign({ accessToken }, profile);

        return next();
      })
      .catch(err => next(new errors.ForbiddenError('Tmc access token is invalid on expired')));
  }
}

module.exports = { getProfile };
