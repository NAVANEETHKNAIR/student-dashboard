import React from 'react';
import { connect } from 'react-redux';
import { TransitionMotion, spring } from 'react-motion';
import prefix from 'react-prefixer';

import withClassPrefix from 'utils/class-prefix';
import { NO_VISUALIZATION } from 'constants/visualizations';
import { openPlugin } from 'state/plugin';

import Icon from 'components/icon';

class PluginOpener extends React.Component {
  renderContent(style) {
    return (
      <button className={withClassPrefix('btn btn-primary plugin-opener')} onClick={this.props.onOpen} style={style} key='pluginOpener'>
        <Icon name="timeline"/>
      </button>
    );
  }

  render() {
    return (
      <TransitionMotion
        willLeave={() => ({ scale: spring(0), opacity: spring(0) })}
        willEnter={() => ({ scale: 0, opacity: 0 })}
        styles={this.props.isVisible ? [{ key: 'pluginOpener', style: { scale: spring(1), opacity: spring(1) } }] : []}
      >
        {interpolated => (
          <div>
            {interpolated.map(({ style }) => this.renderContent(prefix({ transform: `scale(${style.scale})`, opacity: style.opacity })))}
          </div>
        )}
      </TransitionMotion>
    );
  }
}

const mapStateToProps = state => ({
  isVisible: !state.visualization.loading && state.visualization.type !== NO_VISUALIZATION && !state.plugin.isOpen
});

const mapDispatchToProps = dispatch => ({
  onOpen: () => dispatch(openPlugin())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PluginOpener);
