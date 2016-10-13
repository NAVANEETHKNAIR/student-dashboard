import moment from 'moment';

export const CREATE_ACTION = 'ACTIONS::CREATE_ACTION';

export function createAction({ name, meta = {} }) {
  return (dispatch, getState) => {
    const { course: { id: courseId }, visualization: { type: visualizationType } } = getState();

    const now = Math.floor(+(new Date()) / 1000);
    const offsetInMinutes = new Date().getTimezoneOffset() * 60;
    const createdAtAdjustedToTz = now + offsetInMinutes * (-1);

    const hour = moment.utc(createdAtAdjustedToTz * 1000).get('hours');
    const weekday = +moment.utc(createdAtAdjustedToTz * 1000).format('d');

    return dispatch(createActionRequest({ name, meta: Object.assign({}, { visualizationType }, meta), createdAtAdjustedToTz, hour, weekday, source: courseId, createdAt: new Date() }));
  }
}

export function createActionRequest({ name, meta, createdAtAdjustedToTz, hour, weekday, source, createdAt }) {
  return {
    type: CREATE_ACTION,
    /*payload: {
      request: {
        url: '/actions',
        method: 'POST',
        data: { name, meta, createdAtAdjustedToTz, hour, weekday, source, createdAt }
      }
    }*/
  }
}
