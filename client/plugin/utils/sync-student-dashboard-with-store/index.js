import pickBy from 'lodash.pickby';

import withClassPrefix from 'utils/class-prefix';
import { OPEN_PAGE } from 'constants/actions';
import { setActiveExerciseGroup, setExerciseGroupOrder, setExerciseGroups } from 'state/plugin';
import { updateCourse } from 'state/course';
import { updateUser } from 'state/user';
import { createAction } from 'state/actions';

const nop = () => () => {};

function syncStudentDashboardWithStore(store, { onInitialize = nop() } = {}) {
  const self = {};

  self.initialize = options => {
    if(document.querySelector(withClassPrefix('plugin-loader'))) {
      throw new Error('Student dashboard already exists');
    }

    const required = ['courseId', 'exerciseGroups', 'userId', 'accessToken'];

    const notDefined = required
      .map(key => ({ key, value: options[key] }))
      .filter(param => !param.value)
      .map(param => param.key);

    if(notDefined.length > 0) {
      throw new Error(`Missing parameter${notDefined.length === 1 ? '' : 's'} ${notDefined.join(', ')}`);
    }

    const { courseId, courseName, userId, accessToken } = options;

    const exerciseGroups = pickBy(options.exerciseGroups, interval => {
      const [start, end] = interval;

      const now = Math.floor(+(new Date()) / 1000);

      return start <= now;
    });

    const groupNames = Object.keys(exerciseGroups);
    const groupOrder = groupNames.sort((a, b) => exerciseGroups[a][0] - exerciseGroups[b][0]);

    let activeGroup = groupNames[0];

    for(let groupName of groupNames) {
      const [start, end] = exerciseGroups[groupName];
      const now = Math.floor(+(new Date()) / 1000);

      if(now >= start && now <= end) {
        activeGroup = groupName;
        break;
      }
    }

    store.dispatch(setExerciseGroupOrder(groupOrder));
    store.dispatch(setExerciseGroups(exerciseGroups));
    store.dispatch(setActiveExerciseGroup(activeGroup));
    store.dispatch(updateCourse({ id: courseId, name: courseName }));
    store.dispatch(updateUser({ id: userId, accessToken }));
    store.dispatch(createAction({ name: OPEN_PAGE }));

    onInitialize();

    return self;
  }

  self.destroy = () => {
    return self;
  }

  return self;
}

export default syncStudentDashboardWithStore;
