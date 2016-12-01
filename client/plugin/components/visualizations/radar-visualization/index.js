import React from 'react';
import { connect } from 'react-redux';
import ReactHighcharts from 'react-highcharts';
import moment from 'moment';

import withClassPrefix from 'utils/class-prefix';
import { selectActiveExerciseGroup } from 'selectors/plugin';
import VisualizationExplanation from 'components/visualizations/visualization-explanation';
import ProgressLabel from 'components/progress-label';

import './style';

export class RadarVisualization extends React.Component {
  renderPointLabel(points) {
    return (
      <ProgressLabel progress={points * 100}>
        {points * 10} / 10 week points
      </ProgressLabel>
    );
  }

  formatDate(date) {
    return moment(date).format('dddd DD.MM');
  }

  renderExplanation() {
    const { starting, scheduling, earliness, exercises } = this.props.data;

    return (
      <VisualizationExplanation>
        <h4>Starting {this.renderPointLabel(starting.value)}</h4>

        <p className={withClassPrefix('text-muted text-sm m-t-0')}>
          How early you've started solving exercises.
        </p>

        {this.withNoDataInfo(starting)(
          <p>
            Your first submission was on {this.formatDate(starting.meta.startingDate)} while the best date to start was on {this.formatDate(starting.meta.bestStartingDate)}.
          </p>
        )}

        <h4>Exercise points {this.renderPointLabel(exercises.value)}</h4>

        <p className={withClassPrefix('text-muted text-sm m-t-0')}>
          How many exercise points you've earned.
        </p>

        {this.withNoDataInfo(exercises)(
          <p>
            You've earned {exercises.meta.points} points out of total of {exercises.meta.bestPoints}.
          </p>
        )}

        <h4>Earliness {this.renderPointLabel(earliness.value)}</h4>

        <p className={withClassPrefix('text-muted text-sm m-t-0')}>
          By average how far from deadline you've solved exercise.
        </p>

        {this.withNoDataInfo(earliness)(
          <p>
            Your submission are by average {earliness.meta.averageDays} days before the deadline while the optimal average is more than or equal to {earliness.meta.bestAverageDays} days.
          </p>
        )}

        <h4>Scheduling {this.renderPointLabel(scheduling.value)}</h4>

        <p className={withClassPrefix('text-muted text-sm m-t-0')}>
          On how many days you've been solving exercises.
        </p>

        {this.withNoDataInfo(scheduling)(
          <p>
            You've been solving exercises on {scheduling.meta.workingDays} days while the optimal number of days is at least {scheduling.meta.bestWorkingDays}.
          </p>
        )}
      </VisualizationExplanation>
    );
  }

  withNoDataInfo(param) {
    return content => {
      if(!!param.meta.noData) {
        return (
          <p className={withClassPrefix('text-muted')}>
            There's not enough data to calculate your points. Maybe you haven't made any submissions?
          </p>
        );
      } else {
        return content;
      }
    }
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
