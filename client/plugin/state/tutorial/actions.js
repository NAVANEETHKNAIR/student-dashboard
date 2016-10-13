import { finishTutorial } from 'state/user';

export const OPEN_TUTORIAL = 'TUTORIAL::OPEN_TUTORIAL';
export const CLOSE_TUTORIAL = 'TUTORIAL::CLOSE_TUTORIAL';

export function openTutorial() {
  return {
    type: OPEN_TUTORIAL
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
    type: CLOSE_TUTORIAL
  }
}
