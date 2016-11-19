import { createReducer } from 'redux-create-reducer';

import { UPDATE_VISUALIZATION, LOAD_VISUALIZATION, LOAD_VISUALIZATION_ERROR } from 'state/visualization';
import { RESET_PLUGIN } from 'state/plugin';

const initialState = {
  data: {},
  type: null,
  loading: true,
  error: false
};

export default createReducer(initialState, {
  [RESET_PLUGIN](state, action) {
    return initialState;
  },
  [LOAD_VISUALIZATION](state, action) {
    return Object.assign({}, state, { loading: true });
  },
  [LOAD_VISUALIZATION_ERROR](state, action) {
    return Object.assign({}, state, { error: true, loading: false });
  },
  [UPDATE_VISUALIZATION](state, action) {
    return Object.assign({}, state, action.update);
  }
});
