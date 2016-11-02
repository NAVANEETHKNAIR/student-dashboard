import _get from 'lodash.get';

import { createAction } from 'state/actions';

const actionDispatcherMiddleware = store => next => action => {
  if(typeof action === 'object' && _get(action, 'payload.action')) {
    store.dispatch(createAction(action.payload.action));
  }

  return next(action);
}

export default actionDispatcherMiddleware;
