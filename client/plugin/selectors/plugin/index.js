import { createSelector } from 'reselect';

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
