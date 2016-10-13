import React from 'react';
import { connect } from 'react-redux';

import withClassPrefix from 'utils/class-prefix';

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
    } else {
      return <PluginOpener/>
    }
  }
}

const mapStateToProps = state => ({
  isOpen: state.plugin.isOpen
});

const mapDispatchToProps = dispatch => ({
  loadVisualization: () => dispatch(loadVisualization())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PluginLoader);
