import { createSelector } from 'reselect';

import { NO_VISUALIZATION } from 'constants/visualizations';

export const selectIsOpen = state => state.plugin.isOpen;
export const selectHasBeenOpened = state => state.plugin.hasBeenOpened;
export const selectActiveExerciseGroup = state => state.plugin.activeExerciseGroup;
export const selectExerciseGroupOrder = state => state.plugin.exerciseGroupOrder;
export const selectExerciseGroups = state => state.plugin.exerciseGroups;

export const selectActiveExerciseGroupDateInterval = createSelector(
  selectExerciseGroups,
  selectActiveExerciseGroup,
  (groups, activeGroup) => {
    return groups[activeGroup];
  }
);

export const selectOpenerIsVisible = state => !state.visualization.loading && state.visualization.type !== NO_VISUALIZATION && !state.plugin.isOpen;

export const selectActiveIsLastExerciseGroup = createSelector(
  selectExerciseGroupOrder,
  selectActiveExerciseGroup,
  (order, activeGroup) => {
    return order.indexOf(activeGroup) === order.length - 1;
  }
);

export const selectActiveIsFirstExerciseGroup = createSelector(
  selectExerciseGroupOrder,
  selectActiveExerciseGroup,
  (order, activeGroup) => {
    return order.indexOf(activeGroup) === 0;
  }
);
