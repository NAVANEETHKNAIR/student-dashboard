import { createReducer } from 'redux-create-reducer';

import { RESET_PLUGIN, OPEN_PLUGIN, CLOSE_PLUGIN, SET_EXERCISE_GROUPS, SET_EXERCISE_GROUP_ORDER, SET_ACTIVE_EXERCISE_GROUP } from './actions';

const initialState = {
  isOpen: false,
  hasBeenOpened: false,
  activeExerciseGroup: null,
  exerciseGroups: {},
  exerciseGroupOrder: []
};

export default createReducer(initialState, {
  [RESET_PLUGIN](state, action) {
    return initialState;
  },
  [OPEN_PLUGIN](state, action) {
    return Object.assign({}, state, { isOpen: true, hasBeenOpened: true });
  },
  [CLOSE_PLUGIN](state, action) {
    return Object.assign({}, state, { isOpen: false });
  },
  [SET_EXERCISE_GROUPS](state, action) {
    return Object.assign({}, state, { exerciseGroups: action.groups });
  },
  [SET_EXERCISE_GROUP_ORDER](state, action) {
    return Object.assign({}, state, { exerciseGroupOrder: action.order });
  },
  [SET_ACTIVE_EXERCISE_GROUP](state, action) {
    return Object.assign({}, state, { activeExerciseGroup: action.group });
  }
});
