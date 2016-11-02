import React from 'react';
import { connect } from 'react-redux';

import { RADAR_VISUALIZATION, RADAR_VISUALIZATION_WITH_GRADE } from 'constants/visualizations';
import withClassPrefix from 'utils/class-prefix';
import { loadVisualization } from 'state/visualization';

import RadarVisualization from 'components/visualizations/radar-visualization';
import RadarVisualizationWithGrade from 'components/visualizations/radar-visualization-with-grade';

export class Visualization extends React.Component {
  renderContent() {
    const mapTypeToComponent = {
      [RADAR_VISUALIZATION]: RadarVisualization,
      [RADAR_VISUALIZATION_WITH_GRADE]: RadarVisualizationWithGrade
    }

    const Component = mapTypeToComponent[this.props.type];

    return Component
      ? <Component/>
      : null;
  }

  render() {
    return (
      <div>
        {this.renderContent()}

        <div className={withClassPrefix('text-muted text-center text-sm m-t-1')}>
          Visualization updates every two hours. <span className={withClassPrefix('link')} onClick={this.props.onUpdateVisualization}>Update now</span>.
        </div>
      </div>
    );
  }
}

Visualization.propTypes = {
  type: React.PropTypes.oneOf([RADAR_VISUALIZATION, RADAR_VISUALIZATION_WITH_GRADE]).isRequired,
  onUpdateVisualization: React.PropTypes.func
}

const mapStateToProps = state => ({
  type: state.visualization.type
});

const mapDispatchToProps = dispatch => ({
  onUpdateVisualization: () => dispatch(loadVisualization({ cache: false }))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Visualization);
