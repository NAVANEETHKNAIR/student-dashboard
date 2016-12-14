import lget from 'lodash.get';

import { createAction } from 'state/actions';

const actionDispatcherMiddleware = store => next => action => {
  if(typeof action === 'object' && lget(action, 'payload.action')) {
    store.dispatch(createAction(action.payload.action));
  }

  return next(action);
}

export default actionDispatcherMiddleware;
