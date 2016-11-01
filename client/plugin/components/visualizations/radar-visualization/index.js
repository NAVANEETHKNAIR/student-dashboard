import React from 'react';
import { connect } from 'react-redux';
import ReactHighcharts from 'react-highcharts';
import moment from 'moment';

import withClassPrefix from 'utils/class-prefix';
import { selectActiveExerciseGroup } from 'selectors/plugin';

import VisualizationExplanation from 'components/visualizations/visualization-explanation';
import ProgressLabel from 'components/progress-label';

export class RadarVisualization extends React.Component {
  renderPointLabel(points) {
    return (
      <ProgressLabel progress={points * 100}>
        {points * 10} / 10 week points
      </ProgressLabel>
    );
  }

  formatDate(unixTimestamp) {
    return moment(unixTimestamp * 1000).format('dddd DD.MM');
  }

  renderExplanation() {
    return (
      <VisualizationExplanation>
        <h4>Starting {this.renderPointLabel(this.props.data.starting.value)}</h4>

        <p className={withClassPrefix('text-muted text-sm m-t-0')}>
          How early you've started solving exercises.
        </p>

        <p>
          Your first submission was on {this.formatDate(this.props.data.starting.meta.startingDate)} while the best date to start was on {this.formatDate(this.props.data.starting.meta.bestStartingDate)}.
        </p>

        <h4>Exercise points {this.renderPointLabel(this.props.data.exercises.value)}</h4>

        <p className={withClassPrefix('text-muted text-sm m-t-0')}>
          How many exercise points you've earned.
        </p>

        <p>
          You've earned {this.props.data.exercises.meta.points} points out of total of {this.props.data.exercises.meta.bestPoints}.
        </p>

        <h4>Earliness {this.renderPointLabel(this.props.data.earliness.value)}</h4>

        <p className={withClassPrefix('text-muted text-sm m-t-0')}>
          By average how far from deadline you've solved exercise.
        </p>

        <p>
          Your submission are by average {this.props.data.earliness.meta.averageDays} days before the deadline while the optimal average is more than or equal to {this.props.data.earliness.meta.bestAverageDays} days.
        </p>

        <h4>Scheduling {this.renderPointLabel(this.props.data.scheduling.value)}</h4>

        <p className={withClassPrefix('text-muted text-sm m-t-0')}>
          On how many days you've been solving exercises.
        </p>

        <p className={withClassPrefix('m-b-0')}>
          You've been solving exercises on {this.props.data.scheduling.meta.workingDays} days while the optimal number of days is {this.props.data.scheduling.meta.bestWorkingDays}.
        </p>
      </VisualizationExplanation>
    );
  }

  renderChart() {
    return <ReactHighcharts config={this.props.chart} isPureConfig={true}></ReactHighcharts>;
  }

  render() {
    return (
      <div className={withClassPrefix('radar-visualization')}>
        {this.renderExplanation()}
        <div className={withClassPrefix('radar-visualization__chart')}>
          {this.renderChart()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  chart: state.visualization.data.charts[selectActiveExerciseGroup(state)],
  data: state.visualization.data.raw.groups[selectActiveExerciseGroup(state)]
});

export default connect(
  mapStateToProps
)(RadarVisualization);
