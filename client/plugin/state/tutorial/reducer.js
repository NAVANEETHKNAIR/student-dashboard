import { createReducer } from 'redux-create-reducer';

import { OPEN_TUTORIAL, CLOSE_TUTORIAL } from './actions';
import { RESET_PLUGIN } from 'state/plugin';

const initialState = {
  isOpen: false
};

export default createReducer(initialState, {
  [RESET_PLUGIN](state, action) {
    return initialState;
  },
  [OPEN_TUTORIAL](state, action) {
    return Object.assign({}, state, { isOpen: true });
  },
  [CLOSE_TUTORIAL](state, action) {
    return Object.assign({}, state, { isOpen: false });
  }
});
