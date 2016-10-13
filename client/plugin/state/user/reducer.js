import { createReducer } from 'redux-create-reducer';
import { tutorialIsFinished } from 'utils/store';

import { UPDATE_USER } from './actions';

const initialState = {
  accessToken: null,
  id: null,
  tutorialFinished: tutorialIsFinished()
};

export default createReducer(initialState, {
  [UPDATE_USER](state, action) {
    return Object.assign({}, state, action.update);
  }
});
