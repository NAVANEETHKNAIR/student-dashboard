import mapValues from 'map-values';
import compose from 'compose-function';

import { CHART_PRIMARY_COLOR, CHART_SECONDARY_COLOR } from 'constants/colors';
import { RADAR_VISUALIZATION, RADAR_VISUALIZATION_WITH_GRADE, gradeEstimateTypes } from 'constants/visualizations';
import { withDefaults, makeWithTooltip } from 'utils/charts';
import withClassPrefix from 'utils/class-prefix';

const categories = ['Starting', 'Exercise points', 'Earliness', 'Scheduling'];

const categoryToExplanation = {
  'Starting': 'How early you\'ve started solving exercises',
  'Exercise points': 'How many exercise points you\'ve earned',
  'Earliness': 'By average how far from the deadline you\'ve been solving exercises',
  'Scheduling': 'On how many days you\'ve been solving exercises'
};

function getTooltip() {
  return `
    <div>
      ${this.point.category}: ${this.y}/10 points
    </div>
    <div class=${withClassPrefix('chart-tooltip__footer')}>
      ${categoryToExplanation[this.point.category]}
    </div>
  `;
}

export function getRadarChart({ points, name, average }) {
  return compose(makeWithTooltip(getTooltip), withDefaults)({
    chart: {
        polar: true,
        type: 'area'
    },
    pane: {
      size: '60%'
    },
    xAxis: {
      categories,
      tickmarkPlacement: 'on',
      lineWidth: 0,
      labels: {}
    },
    yAxis: {
      gridLineInterpolation: 'polygon',
      lineWidth: 0,
      min: 0,
      max: 10,
      tickInterval: 5
    },
    series: [
      {
        name: 'My average',
        data: [average.starting * 10, average.exercises * 10, average.earliness * 10, average.scheduling * 10],
        color: CHART_SECONDARY_COLOR,
        fillOpacity: 0,
        pointPlacement: 'on'
      },
      {
        name,
        data: [points.starting.value * 10, points.exercises.value * 10, points.earliness.value * 10, points.scheduling.value * 10],
        color: CHART_PRIMARY_COLOR,
        fillOpacity: 0.5,
        pointPlacement: 'on'
      }
    ]
  });
}

export function getVisualization({ type, data }) {
  let charts = null;

  if([RADAR_VISUALIZATION, RADAR_VISUALIZATION_WITH_GRADE].includes(type)) {
    charts = mapValues(data.groups, (value, key) => getRadarChart({ name: key, points: value, average: data.average }));
  }

  const visualization = charts ? { charts, raw: data } : { raw: data };

  return gradeEstimateTypes.includes(type)
    ? Object.assign({}, visualization, { estimatedGrade: data.estimatedGrade })
    : visualization;
}
