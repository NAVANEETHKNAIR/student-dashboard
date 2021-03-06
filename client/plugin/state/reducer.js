import { combineReducers } from 'redux';

import plugin from 'state/plugin';
import course from 'state/course';
import visualization from 'state/visualization';
import tutorial from 'state/tutorial';
import user from 'state/user';
import surveyModal from 'state/survey-modal';

export default combineReducers({
  plugin,
  course,
  visualization,
  tutorial,
  user,
  surveyModal,
});
