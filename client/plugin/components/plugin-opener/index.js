import React from 'react';
import { connect } from 'react-redux';

import withClassPrefix from 'utils/class-prefix';

import { openPlugin } from 'state/plugin';

import Icon from 'components/icon';

class PluginOpener extends React.Component {
  render() {
    return (
      <button className={withClassPrefix('btn btn-primary plugin-opener')} onClick={this.props.onOpen}>
        <Icon name="timeline"/>
      </button>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  onOpen: () => dispatch(openPlugin())
});

export default connect(
  null,
  mapDispatchToProps
)(PluginOpener);
