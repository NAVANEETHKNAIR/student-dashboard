import { createReducer } from 'redux-create-reducer';

import { UPDATE_COURSE } from './actions';

const initialState = {
  id: null,
  name: null
}

export default createReducer(initialState, {
  [UPDATE_COURSE](state, action) {
    return Object.assign({}, state, action.update);
  }
});
