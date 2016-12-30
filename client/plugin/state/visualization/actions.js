import lget from 'lodash.get';

import {
  OPEN_PAGE,
  UPDATE_VISUALIZATION as UPDATE_VISUALIZATION_ACTION,
  MOUSE_ENTER_RADAR_VISUALIZATION,
  SCROLL_TEXTUAL_VISUALIZATION,
} from 'constants/actions';

import { setLastSeenVisualization } from 'utils/store';
import { createAction } from 'state/actions';
import * as actionConstants from 'constants/actions';

export const UPDATE_VISUALIZATION = 'VISUALIZATION_UPDATE_VISUALIZATION';
export const LOAD_VISUALIZATION = 'VISUALIZATION_LOAD_VISUALIZATION';
export const LOAD_VISUALIZATION_FAIL = 'VISUALIZATION_LOAD_VISUALIZATION_FAIL';
export const LOAD_VISUALIZATION_SUCCESS = 'VISUALIZATION_LOAD_VISUALIZATION_SUCCESS'
export const OPEN_EXPLANATION = 'VISUALIZATION_OPEN_EXPLANATION';
export const CLOSE_EXPLANATION = 'VISUALIZATION_CLOSE_EXPLANATION';

export function loadVisualization({ cache = true } = {}) {
  return (dispatch, getState) => {
    const {
      plugin: { exerciseGroups, isOpen: pluginIsOpen },
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

        if(pluginIsOpen) {
          setLastSeenVisualization(response.data);
        }
      });
  }
}

export function closeGradeEstimate() {
  return (dispatch, getState) => {
    const estimatedGrade = lget(getState(), 'visualization.data.estimatedGrade');

    return dispatch(createAction({
      name: actionConstants.CLOSE_GRADE_ESTIMATE,
      meta: { estimatedGrade },
    }));
  }
}

export function openGradeEstimate() {
  return (dispatch, getState) => {
    const estimatedGrade = lget(getState(), 'visualization.data.estimatedGrade');

    return dispatch(createAction({
      name: actionConstants.OPEN_GRADE_ESTIMATE,
      meta: { estimatedGrade },
    }));
  }
}

export function mouseEnterRadar() {
  return dispatch => {
    return dispatch(createAction({ name: MOUSE_ENTER_RADAR_VISUALIZATION }));
  };
}

export function scrollTextual() {
  return dispatch => {
    return dispatch(createAction({ name: SCROLL_TEXTUAL_VISUALIZATION }));
  };
}

export function closeExplanation() {
  return {
    type: CLOSE_EXPLANATION,
    payload: {
      action: {
        name: actionConstants.CLOSE_EXPLANATION
      }
    }
  };
}

export function openExplanation() {
  return {
    type: OPEN_EXPLANATION,
    payload: {
      action: {
        name: actionConstants.OPEN_EXPLANATION
      }
    }
  };
}

export function toggleExplanation() {
  return (dispatch, getState) => {
    const { visualization: { explanationIsOpen } } = getState();

    return explanationIsOpen
      ? dispatch(closeExplanation())
      : dispatch(openExplanation());
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
