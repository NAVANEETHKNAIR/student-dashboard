import lget from 'lodash.get';

import { loadVisualization, setUpdateTimeout, LOAD_VISUALIZATION_SUCCESS } from 'state/visualization';

const visualizationUpdaterMiddleware = store => next => action => {
  if(typeof action === 'object' && lget(action, 'type') === LOAD_VISUALIZATION_SUCCESS) {
    const timeout = setTimeout(() => {
      store.dispatch(loadVisualization({ cache: false, actionify: false }));
    }, 1000 * 60 * 60);

    store.dispatch(setUpdateTimeout(timeout));
  }

  return next(action);
}

export default visualizationUpdaterMiddleware;
