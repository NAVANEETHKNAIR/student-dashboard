import { createSelector } from 'reselect';

import { selectHasBeenOpened } from 'selectors/plugin';
import { selectVisualization } from 'selectors/visualization';

export const selectIsVisible = createSelector(
  selectVisualization,
  selectHasBeenOpened,
  (visualization, pluginHasBeenOpened) => !pluginHasBeenOpened && visualization.isFresh
);
