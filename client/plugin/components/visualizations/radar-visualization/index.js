import React from 'react';
import { connect } from 'react-redux';
import ReactHighcharts from 'react-highcharts';

import withClassPrefix from 'utils/class-prefix';
import { selectActiveChart, selectActiveData } from 'selectors/visualization';
import VisualizationExplanationDropdown from 'components/visualizations/visualization-explanation-dropdown';
import DefaultVisualizationExplanation from 'components/visualizations/default-visualization-explanation';

export class RadarVisualization extends React.Component {
  renderChart() {
    return <ReactHighcharts config={this.props.chart} isPureConfig={true}></ReactHighcharts>;
  }

  render() {
    return (
      <div className={withClassPrefix('radar-visualization')}>
        <VisualizationExplanationDropdown>
          <DefaultVisualizationExplanation data={this.props.data} />
        </VisualizationExplanationDropdown>
        
        <div className={withClassPrefix('radar-visualization__chart')}>
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

export default connect(
  mapStateToProps
)(RadarVisualization);
