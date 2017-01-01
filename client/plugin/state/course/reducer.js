import { createReducer } from 'redux-create-reducer';

import { UPDATE_COURSE } from './actions';
import { RESET_PLUGIN } from 'state/plugin';

const initialState = {
  id: null,
  name: null
}

export default createReducer(initialState, {
  [RESET_PLUGIN](state, action) {
    return Object.assign({}, initialState);
  },
  [UPDATE_COURSE](state, action) {
    return Object.assign({}, state, action.update);
  }
});
