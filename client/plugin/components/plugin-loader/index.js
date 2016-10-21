import React from 'react';
import { connect } from 'react-redux';

import withClassPrefix from 'utils/class-prefix';
import { loadVisualization } from 'state/visualization';

import Plugin from 'components/plugin';
import PluginOpener from 'components/plugin-opener';
import TutorialModal from 'components/tutorial-modal';

class PluginLoader extends React.Component {
  componentDidMount() {
    this.props.loadVisualization();
  }

  render() {
    return (
      <div>
        <Plugin/>
        <PluginOpener/>
        <TutorialModal/>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  loadVisualization: () => dispatch(loadVisualization())
});

export default connect(
  null,
  mapDispatchToProps
)(PluginLoader);
