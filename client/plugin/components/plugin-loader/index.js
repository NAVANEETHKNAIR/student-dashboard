import React from 'react';
import { connect } from 'react-redux';

import withClassPrefix from 'utils/class-prefix';
import { NO_VISUALIZATION } from 'constants/visualizations';
import { loadVisualization } from 'state/visualization';

import Plugin from 'components/plugin';
import PluginOpener from 'components/plugin-opener';

class PluginLoader extends React.Component {
  componentDidMount() {
    this.props.loadVisualization();
  }

  render() {
    if(this.props.isOpen) {
      return <Plugin/>;
    } else if(this.props.isVisible) {
      return <PluginOpener/>
    } else {
      return null;
    }
  }
}

const mapStateToProps = state => ({
  isOpen: state.plugin.isOpen,
  isVisible: !state.visualization.loading && state.visualization.type !== NO_VISUALIZATION
});

const mapDispatchToProps = dispatch => ({
  loadVisualization: () => dispatch(loadVisualization())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PluginLoader);
