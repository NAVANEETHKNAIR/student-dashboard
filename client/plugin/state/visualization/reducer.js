import { createReducer } from 'redux-create-reducer';

import { getVisualization } from 'utils/visualizations';
import { UPDATE_VISUALIZATION, LOAD_VISUALIZATION, LOAD_VISUALIZATION_FAIL, LOAD_VISUALIZATION_SUCCESS } from 'state/visualization';
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
  [LOAD_VISUALIZATION_SUCCESS](state, action) {
    const { data, type } = action.payload.data;

    return Object.assign({}, state, { data: getVisualization({ data, type }), type, loading: false, error: false });
  },
  [LOAD_VISUALIZATION_FAIL](state, action) {
    return Object.assign({}, state, { error: true, loading: false });
  },
  [UPDATE_VISUALIZATION](state, action) {
    return Object.assign({}, state, action.update);
  }
});
