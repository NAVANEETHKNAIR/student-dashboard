import { createAction } from 'state/actions';

import {
  OPEN_PAGE,
  UPDATE_VISUALIZATION as UPDATE_VISUALIZATION_ACTION
} from 'constants/actions';

export const UPDATE_VISUALIZATION = 'VISUALIZATION_UPDATE_VISUALIZATION';
export const LOAD_VISUALIZATION = 'VISUALIZATION_LOAD_VISUALIZATION';
export const LOAD_VISUALIZATION_FAIL = 'VISUALIZATION_LOAD_VISUALIZATION_FAIL';
export const LOAD_VISUALIZATION_SUCCESS = 'VISUALIZATION_LOAD_VISUALIZATION_SUCCESS'

export function loadVisualization({ cache = true } = {}) {
  return (dispatch, getState) => {
    const {
      plugin: { exerciseGroups },
      course: { id: courseId },
      visualization: { type: visualizationType }
    } = getState();

    return dispatch(loadVisualizationRequest({ courseId, exerciseGroups, cache }))
      .then(response => {
        if(!visualizationType) {
          dispatch(createAction({ name: OPEN_PAGE }));
        } else if(!cache) {
          dispatch(createAction({ name: UPDATE_VISUALIZATION_ACTION }));
        }
      });
  }
}

export function updateVisualization(update) {
  return {
    type: UPDATE_VISUALIZATION,
    update
  }
}

export function loadVisualizationRequest({ courseId, exerciseGroups, cache }) {
  return {
    type: LOAD_VISUALIZATION,
    payload: {
      request: {
        url: `/courses/${courseId}/visualization/user`,
        method: 'POST',
        data: {
          exerciseGroups,
          cache
        }
      }
    }
  }
}
