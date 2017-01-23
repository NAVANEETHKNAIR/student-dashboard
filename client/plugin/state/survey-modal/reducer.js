import { createReducer } from 'redux-create-reducer';

import {
  OPEN_SURVEY_MODAL,
  CLOSE_SURVEY_MODAL,
  UPDATE_SURVEY_ANSWER,
  CREATE_SURVEY_ANSWER,
  CREATE_SURVEY_ANSWER_SUCCESS,
  CREATE_SURVEY_ANSWER_FAIL,
} from './actions';

import { RESET_PLUGIN } from 'state/plugin';

const initialState = {
  isOpen: false,
  error: false,
  submitting: false,
  answers: {},
};

export default createReducer(initialState, {
  [RESET_PLUGIN](state, action) {
    return Object.assign({}, initialState);
  },
  [OPEN_SURVEY_MODAL](state, action) {
    return Object.assign({}, state, { isOpen: true });
  },
  [CLOSE_SURVEY_MODAL](state, action) {
    return Object.assign({}, state, { isOpen: false });
  },
  [UPDATE_SURVEY_ANSWER](state, action) {
    const { id, value } = action;

    return Object.assign({}, state, {
      answers: Object.assign({}, state.answers, { [id]: value })
    });
  },
  [CREATE_SURVEY_ANSWER](state, action) {
    return Object.assign({}, state, { submitting: true, error: false });
  },
  [CREATE_SURVEY_ANSWER_SUCCESS](state, action) {
    return Object.assign({}, state, { submitting: false, error: false });
  },
  [CREATE_SURVEY_ANSWER_FAIL](state, action) {
    return Object.assign({}, state, { submitting: false, error: true });
  },
});
