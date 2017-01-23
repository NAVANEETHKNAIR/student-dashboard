export const OPEN_SURVEY_MODAL = 'SURVEY_MODAL_OPEN_SURVEY_MODAL';
export const CLOSE_SURVEY_MODAL = 'SURVEY_MODAL_CLOSE_SURVEY_MODAL';
export const UPDATE_SURVEY_ANSWER = 'SURVEY_MODAL_UPDATE_SURVEY_ANSWER';
export const CREATE_SURVEY_ANSWER = 'SURVEY_MODAL_CREATE_SURVEY_ANSWER';
export const CREATE_SURVEY_ANSWER_SUCCESS = 'SURVEY_MODAL_CREATE_SURVEY_ANSWER_SUCCESS';
export const CREATE_SURVEY_ANSWER_FAIL = 'SURVEY_MODAL_CREATE_SURVEY_ANSWER_FAIL';
export const FETCH_SURVEY_ANSWER = 'SURVEY_MODAL_FETCH_SURVEY_ANSWER';

export function openSurveyModal() {
  return {
    type: OPEN_SURVEY_MODAL,
  };
}

export function closeSurveyModal() {
  return {
    type: CLOSE_SURVEY_MODAL,
  };
}

export function updateSurveyAnswer({ id, value }) {
  return {
    id,
    value,
    type: UPDATE_SURVEY_ANSWER
  };
}

export function submitSurvey() {
  return (dispatch, getState) => {
    const { course: { id: courseId }, surveyModal: { answers: data } } = getState();

    return dispatch(createSurveyAnswer({ courseId, data }));
  };
}

export function fetchSurveyAnswer({ courseId }) {
  return {
    type: FETCH_SURVEY_ANSWER,
    payload: {
      request: {
        url: `/courses/${courseId}/survey-answers/user`,
        method: 'GET',
      },
    },
  };
}

export function createSurveyAnswer({ courseId, data }) {
  return {
    type: CREATE_SURVEY_ANSWER,
    payload: {
      request: {
        url: `/courses/${courseId}/survey-answers`,
        method: 'POST',
        data: {
          data,
        },
      },
    },
  };
}
