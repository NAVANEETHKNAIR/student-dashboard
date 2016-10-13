import * as actionConstants from 'constants/actions';

import { createAction } from 'state/actions';

export const OPEN_PLUGIN = 'PLUGIN::OPEN_PLUGIN';
export const CLOSE_PLUGIN = 'PLUGIN::CLOSE_PLUGIN';
export const SET_ACTIVE_EXERCISE_GROUP = 'PLUGIN::SET_ACTIVE_EXERCISE_GROUP';
export const SET_EXERCISE_GROUPS = 'COURSE::SET_EXERCISE_GROUPS';
export const SET_EXERCISE_GROUP_ORDER = 'COURSE::SET_EXERCISE_GROUP_ORDER';

export function setActiveExerciseGroup(group) {
  return {
    type: SET_ACTIVE_EXERCISE_GROUP,
    group
  }
}

export function setExerciseGroups(groups) {
  return {
    type: SET_EXERCISE_GROUPS,
    groups
  }
}

export function setExerciseGroupOrder(order) {
  return {
    type: SET_EXERCISE_GROUP_ORDER,
    order
  }
}

export function moveToExerciseGroup(direction) {
  return (dispatch, getState) => {
    const { plugin: { exerciseGroupOrder, activeExerciseGroup } } = getState();

    const currentIndex = exerciseGroupOrder.indexOf(activeExerciseGroup);
    const nextActiveExerciseGroup = exerciseGroupOrder[currentIndex + direction];

    dispatch(createAction({ name: actionConstants.CHANGE_EXERCISE_GROUP, meta: { from: activeExerciseGroup, to: nextActiveExerciseGroup } }));
    dispatch(setActiveExerciseGroup(nextActiveExerciseGroup));
  }
}

export function goToNextExerciseGroup() {
  return dispatch => dispatch(moveToExerciseGroup(1));
}

export function goToPrevExerciseGroup() {
  return dispatch => dispatch(moveToExerciseGroup(-1));
}

export function closePlugin() {
  return dispatch => {
    dispatch(createAction({ name: actionConstants.CLOSE_PLUGIN }));
    dispatch(closePluginCreator());
  }
}

export function openPlugin() {
  return dispatch => {
    dispatch(createAction({ name: actionConstants.OPEN_PLUGIN }));
    dispatch(openPluginCreator());
  }
}

export function closePluginCreator() {
  return {
    type: CLOSE_PLUGIN
  }
}

export function openPluginCreator() {
  return {
    type: OPEN_PLUGIN
  }
}
