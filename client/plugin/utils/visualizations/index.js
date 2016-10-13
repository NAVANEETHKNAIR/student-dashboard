import mapValues from 'map-values';

import { CHART_PRIMARY_COLOR, CHART_SECONDARY_COLOR } from 'constants/colors';
import { RADAR_VISUALIZATION } from 'constants/visualizations';
import { withDefaults } from 'utils/charts';

export function getRadarChart({ points, name, average }) {
  return withDefaults({
    chart: {
        polar: true,
        type: 'area'
    },
    pane: {
      size: '60%'
    },
    xAxis: {
        categories: ['Starting', 'Exercise points', 'Earliness', 'Scheduling'],
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
  switch(type) {
    case RADAR_VISUALIZATION:
      return {
        charts: mapValues(data.groups, (value, key) => getRadarChart({ name: key, points: value, average: data.average })),
        raw: data
      }
      break;
    default:
      return {};
  }
}
