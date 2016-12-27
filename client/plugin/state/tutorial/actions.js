import { finishTutorial } from 'state/user';

import {
  OPEN_TUTORIAL as OPEN_TUTORIAL_ACTION,
  CLOSE_TUTORIAL as CLOSE_TUTORIAL_ACTION
} from 'constants/actions';

export const OPEN_TUTORIAL = 'TUTORIAL_OPEN_TUTORIAL';
export const CLOSE_TUTORIAL = 'TUTORIAL_CLOSE_TUTORIAL';

export function openTutorial() {
  return {
    type: OPEN_TUTORIAL,
    payload: {
      action: {
        name: OPEN_TUTORIAL_ACTION
      }
    }
  }
}

export function closeTutorial() {
  return dispatch => {
    dispatch(finishTutorial());
    dispatch(closeTutorialCreator());
  }
}

export function closeTutorialCreator() {
  return {
    type: CLOSE_TUTORIAL,
    payload: {
      action: {
        name: CLOSE_TUTORIAL_ACTION
      }
    }
  }
}
