import { createReducer } from 'redux-create-reducer';

import { OPEN_TUTORIAL, CLOSE_TUTORIAL } from './actions';

const initialState = {
  isOpen: false
};

export default createReducer(initialState, {
  [OPEN_TUTORIAL](state, action) {
    return Object.assign({}, state, { isOpen: true });
  },
  [CLOSE_TUTORIAL](state, action) {
    return Object.assign({}, state, { isOpen: false });
  }
});
