import React from 'react';
import { connect } from 'react-redux';

import { RADAR_VISUALIZATION, TEXTUAL_VISUALIZATION, RADAR_VISUALIZATION_PLAIN } from 'constants/visualizations';
import withClassPrefix from 'utils/class-prefix';
import { loadVisualization } from 'state/visualization';
import RadarVisualization from 'components/visualizations/radar-visualization';
import TextualVisualization from 'components/visualizations/textual-visualization';

export class Visualization extends React.Component {
  static propTypes = {
    type: React.PropTypes.oneOf([
      RADAR_VISUALIZATION,
      TEXTUAL_VISUALIZATION,
      RADAR_VISUALIZATION_PLAIN,
    ]).isRequired,
    onUpdateVisualization: React.PropTypes.func
  }

  renderContent() {
    const mapTypeToComponent = {
      [RADAR_VISUALIZATION]: RadarVisualization,
      [TEXTUAL_VISUALIZATION]: TextualVisualization,
      [RADAR_VISUALIZATION_PLAIN]: RadarVisualization,
    };

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
          This visualization updates every hour. <span className={withClassPrefix('link')} onClick={this.props.onUpdateVisualization}>Update the visualization now</span>.
        </div>
      </div>
    );
  }
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
