import React from 'react';
import { connect } from 'react-redux';

import { RADAR_VISUALIZATION } from 'constants/visualizations';
import withClassPrefix from 'utils/class-prefix';
import { loadVisualization } from 'state/visualization';

import RadarVisualization from 'components/visualizations/radar-visualization';

class Visualization extends React.Component {
  renderContent() {
    return <RadarVisualization/>;
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
  type: React.PropTypes.oneOf([RADAR_VISUALIZATION]).isRequired,
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
