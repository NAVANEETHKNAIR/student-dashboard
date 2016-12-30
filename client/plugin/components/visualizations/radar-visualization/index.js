import React from 'react';
import { connect } from 'react-redux';
import ReactHighcharts from 'react-highcharts';

import withClassPrefix from 'utils/class-prefix';
import { mouseEnterRadar } from 'state/visualization';
import { selectActiveChart, selectActiveData } from 'selectors/visualization';
import VisualizationExplanationDropdown from 'components/visualizations/visualization-explanation-dropdown';
import DefaultVisualizationExplanation from 'components/visualizations/default-visualization-explanation';

export class RadarVisualization extends React.Component {
  constructor() {
    super();

    this.hasBeenMouseEntered = false;
    this.onChartMouseEnter = this.onChartMouseEnter.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.chart !== this.props.chart) {
      this.hasBeenMouseEntered = false;
    }
  }

  renderChart() {
    return <ReactHighcharts config={this.props.chart} isPureConfig={true}></ReactHighcharts>;
  }

  onChartMouseEnter() {
    if(!this.hasBeenMouseEntered) {
      this.props.onChartMouseEnter();
      this.hasBeenMouseEntered = true;
    }
  }

  render() {
    return (
      <div className={withClassPrefix('radar-visualization')}>
        <VisualizationExplanationDropdown>
          <DefaultVisualizationExplanation data={this.props.data} />
        </VisualizationExplanationDropdown>

        <div className={withClassPrefix('radar-visualization__chart')} onMouseEnter={this.onChartMouseEnter}>
          {this.renderChart()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  chart: selectActiveChart(state),
  data: selectActiveData(state)
});

const mapDispatchToProps = dispatch => ({
  onChartMouseEnter: () => dispatch(mouseEnterRadar()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RadarVisualization);
