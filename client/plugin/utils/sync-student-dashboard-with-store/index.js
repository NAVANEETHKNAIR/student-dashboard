import pickBy from 'lodash.pickby';
import mapValues from 'map-values';
import moment from 'moment';
import { unmountComponentAtNode } from 'react-dom';

import withClassPrefix from 'utils/class-prefix';
import { setActiveExerciseGroup, setExerciseGroupOrder, setExerciseGroups, resetPlugin } from 'state/plugin';
import { updateCourse } from 'state/course';
import { updateUser } from 'state/user';

const nop = () => () => {};

function syncStudentDashboardWithStore(store, { onInitialize = nop() } = {}) {
  const self = {};

  self.initialize = (options = {}) => {
    if(document.querySelector(withClassPrefix('plugin-loader'))) {
      throw new Error('Student dashboard already exists');
    }

    const required = ['courseId', 'courseName', 'exerciseGroups', 'accessToken'];

    const notDefined = required
      .map(key => ({ key, value: options[key] }))
      .filter(param => !param.value)
      .map(param => param.key);

    if(notDefined.length > 0) {
      throw new Error(`Missing parameter${notDefined.length === 1 ? '' : 's'} ${notDefined.join(', ')}`);
    }

    const { courseId, courseName, userId, accessToken } = options;

    const exerciseGroupsWithTimestamps = mapValues(options.exerciseGroups, interval => {
      const [start, end, exercisePrefix] = interval;
      const format = 'DD.MM.YYYY HH:mm';

      return [moment.utc(start, format).unix(), moment.utc(end, format).unix(), exercisePrefix || null];
    });

    const exerciseGroups = pickBy(exerciseGroupsWithTimestamps, interval => {
      const [start, end] = interval;
      const now = Math.floor(+new Date() / 1000);

      return options.showAllExerciseGroups === true ? true : start <= now;
    });

    const groupNames = Object.keys(exerciseGroups);
    const groupOrder = groupNames.sort((a, b) => exerciseGroups[a][0] - exerciseGroups[b][0]);

    let activeGroup = groupNames[0];

    for(let groupName of groupNames) {
      const [start, end] = exerciseGroups[groupName];
      const now = Math.floor(+new Date() / 1000);

      if(now >= start && now <= end) {
        activeGroup = groupName;
        break;
      }
    }

    store.dispatch(setExerciseGroupOrder(groupOrder));
    store.dispatch(setExerciseGroups(exerciseGroups));
    store.dispatch(setActiveExerciseGroup(activeGroup));
    store.dispatch(updateCourse({ id: courseId, name: courseName }));
    store.dispatch(updateUser({ id: userId || null, accessToken }));

    onInitialize();

    return self;
  }

  self.destroy = () => {
    const body = document.querySelector('body');
    const container = document.querySelector(`.${withClassPrefix('plugin-wrapper')}`);

    unmountComponentAtNode(container);

    body.removeChild(container);

    store.dispatch(resetPlugin());

    return self;
  }

  return self;
}

export default syncStudentDashboardWithStore;
