import React from 'react';
import { connect } from 'react-redux';
import ReactHighcharts from 'react-highcharts';

import withClassPrefix from 'utils/class-prefix';
import { selectActiveExerciseGroup } from 'selectors/plugin';

import VisualizationExplanation from 'components/visualizations/visualization-explanation';
import ProgressLabel from 'components/progress-label';

class RadarVisualization extends React.Component {
  renderPointLabel(points) {
    return (
      <ProgressLabel progress={points * 100}>
        {points * 10} / 10 week points
      </ProgressLabel>
    );
  }

  renderExplanation() {
    return (
      <VisualizationExplanation>
        <h4>Starting {this.renderPointLabel(this.props.data.starting.value)}</h4>

        <p>
          How early you've started solving exercises.
        </p>

        <h4>Exercise points {this.renderPointLabel(this.props.data.exercises.value)}</h4>

        <p>
          How many exercise points you've received.
        </p>

        <h4>Earliness {this.renderPointLabel(this.props.data.earliness.value)}</h4>

        <p>
          By average how far from deadline you've solved exercise.
        </p>

        <h4>Scheduling {this.renderPointLabel(this.props.data.scheduling.value)}</h4>

        <p className={withClassPrefix('m-b-0')}>
          On how many days you've been solving exercises.
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
