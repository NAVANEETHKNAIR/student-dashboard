export const UPDATE_COURSE = 'COURSE::UPDATE_COURSE';

export function updateCourse(update) {
  return {
    type: UPDATE_COURSE,
    update
  }
}
