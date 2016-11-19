export const UPDATE_COURSE = 'COURSE_UPDATE_COURSE';

export function updateCourse(update) {
  return {
    type: UPDATE_COURSE,
    update
  }
}
