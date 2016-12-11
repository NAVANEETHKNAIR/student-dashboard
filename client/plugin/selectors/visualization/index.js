import { createSelector } from 'reselect';
import _get from 'lodash.get';

import { selectActiveExerciseGroup } from 'selectors/plugin';

export const selectVisualization = state => state.visualization;

export const selectActiveChart = createSelector(
  selectVisualization,
  selectActiveExerciseGroup,
  (visualization, activeExerciseGroup) => _get(visualization, ['data', 'charts', activeExerciseGroup]) || null
);

export const selectActiveData = createSelector(
  selectVisualization,
  selectActiveExerciseGroup,
  (visualization, activeExerciseGroup) => _get(visualization, ['data', 'raw', 'groups', activeExerciseGroup]) || null
);
