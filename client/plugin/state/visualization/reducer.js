import { createReducer } from 'redux-create-reducer';

import { getLastSeenVisualization } from 'utils/store';
import { getVisualization } from 'utils/visualizations';
import { SET_UPDATE_TIMEOUT, OPEN_EXPLANATION, CLOSE_EXPLANATION, UPDATE_VISUALIZATION, LOAD_VISUALIZATION, LOAD_VISUALIZATION_FAIL, LOAD_VISUALIZATION_SUCCESS } from 'state/visualization';
import { RESET_PLUGIN } from 'state/plugin';

const initialState = {
  data: {},
  type: null,
  isFresh: false,
  loading: true,
  error: false,
  explanationIsOpen: false,
  updateTimeout: null
};

function isFresh(previousVisualization, visualization) {
  const previousGroups = previousVisualization.groups || {};
  const groups = visualization.groups || {};

  return Object.keys(previousGroups).length !== Object.keys(groups).length;
}

export default createReducer(initialState, {
  [RESET_PLUGIN](state, action) {
    return initialState;
  },
  [LOAD_VISUALIZATION](state, action) {
    return Object.assign({}, state, { loading: true });
  },
  [LOAD_VISUALIZATION_SUCCESS](state, action) {
    const { data, type } = action.payload.data;
    const previousVisualization = getLastSeenVisualization() || {};

    return Object.assign({}, state, {
      data: getVisualization({ data, type }),
      isFresh: isFresh(previousVisualization, data || {}),
      loading: false,
      error: false,
      type
    });
  },
  [LOAD_VISUALIZATION_FAIL](state, action) {
    return Object.assign({}, state, { error: true, loading: false });
  },
  [UPDATE_VISUALIZATION](state, action) {
    return Object.assign({}, state, action.update);
  },
  [OPEN_EXPLANATION](state, action) {
    return Object.assign({}, state, { explanationIsOpen: true });
  },
  [CLOSE_EXPLANATION](state, action) {
    return Object.assign({}, state, { explanationIsOpen: false });
  },
  [SET_UPDATE_TIMEOUT](state, action) {
    const currentTimeout = state.updateTimeout;

    if(currentTimeout) {
      clearTimeout(currentTimeout);
    }

    return Object.assign({}, state, { updateTimeout: action.timeout });
  }
});
