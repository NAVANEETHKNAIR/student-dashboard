import { tutorialIsFinished, setTutorialAsFinished } from 'utils/store';

export const UPDATE_USER = 'USER::UPDATE_USER';

export function updateUser(update) {
  return {
    type: UPDATE_USER,
    update
  }
}

export function finishTutorial() {
  return dispatch => {
    setTutorialAsFinished();

    dispatch(updateUser({ tutorialFinished: true }));
  }
}
