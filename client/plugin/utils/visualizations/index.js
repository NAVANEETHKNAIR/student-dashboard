import mapValues from 'map-values';
import compose from 'compose-function';
import round from 'lodash.round';

import { CHART_PRIMARY_COLOR, CHART_SECONDARY_COLOR } from 'constants/colors';
import { RADAR_VISUALIZATION, RADAR_VISUALIZATION_WITH_GRADE, RADAR_VISUALIZATION_PLAIN, gradeEstimateTypes } from 'constants/visualizations';
import { withDefaults, makeWithTooltip } from 'utils/charts';
import withClassPrefix from 'utils/class-prefix';

const categories = ['Starting', 'Exercise points', 'Earliness', 'Scheduling'];

const categoryToExplanation = {
  'Starting': 'How early student started solving exercises',
  'Exercise points': 'How many exercise points student has earned',
  'Earliness': 'By average how far from the deadline student has been solving exercises',
  'Scheduling': 'On how many days student has been solving exercises'
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
  const averageSerie = average
    ? {
        name: 'Course\'s average points',
        data: [average.starting * 10, average.exercises * 10, average.earliness * 10, average.scheduling * 10].map(value => round(value, 1)),
        color: CHART_SECONDARY_COLOR,
        fillOpacity: 0.25,
        pointPlacement: 'on'
      }
    : null;

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
      averageSerie,
      {
        name,
        data: [points.starting.value * 10, points.exercises.value * 10, points.earliness.value * 10, points.scheduling.value * 10].map(value => round(value, 1)),
        color: CHART_PRIMARY_COLOR,
        fillOpacity: 0.5,
        pointPlacement: 'on'
      }
    ].filter(s => !!s),
  });
}

export function getVisualization({ type, data }) {
  let charts = null;

  if([RADAR_VISUALIZATION, RADAR_VISUALIZATION_WITH_GRADE, RADAR_VISUALIZATION_PLAIN].includes(type)) {
    const average = type !== RADAR_VISUALIZATION_PLAIN ? data.courseAverage : null;

    charts = mapValues(data.groups, (value, key) => getRadarChart({ name: `My points on ${key}`, points: value, average }));
  }

  const visualization = charts ? { charts, raw: data } : { raw: data };

  return gradeEstimateTypes.includes(type)
    ? Object.assign({}, visualization, { estimatedGrade: data.estimatedGrade })
    : visualization;
}
