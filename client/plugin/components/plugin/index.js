import React from 'react';
import { connect } from 'react-redux';
import { TransitionMotion, spring } from 'react-motion';
import prefix from 'react-prefixer';

import withClassPrefix from 'utils/class-prefix';

import { loadVisualization } from 'state/visualization';
import WeekSelector from 'components/week-selector';
import PluginHeader from 'components/plugin-header';
import Loader from 'components/loader';
import Visualization from 'components/visualizations/visualization';
import Icon from 'components/icon';

export class Plugin extends React.Component {
  renderVisualization() {
    if(this.props.visualizationLoading) {
      return <Loader/>;
    } else if(!this.props.visualizationLoading && !this.props.visualizationError) {
      return <Visualization/>;
    } else {
      return (
        <div className={withClassPrefix('text-muted text-center')}>
          Couldn't load the visualization from the server.
          Try logging in again and <a className={withClassPrefix('link')} onClick={this.props.onReloadVisualization}>reloading the visualization</a>.
        </div>
      )
    }
  }

  renderContent(style) {
    return (
      <div className={withClassPrefix('plugin')} key='plugin' style={style}>
        <PluginHeader>
          My progress in {this.props.courseName}
        </PluginHeader>

        <div className={withClassPrefix('divider')}></div>

        <div className={withClassPrefix('p-t-1')}>
          <WeekSelector/>
        </div>

        <div className={withClassPrefix('plugin__content')}>
          {this.renderVisualization()}
        </div>
      </div>
    );
  }

  render() {
    return (
      <TransitionMotion
        willLeave={() => ({ scale: spring(0), opacity: spring(0) })}
        willEnter={() => ({ scale: 0, opacity: 0 })}
        styles={this.props.isOpen ? [{ key: 'plugin', style: { scale: spring(1), opacity: spring(1) } }] : []}
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
  visualizationLoading: state.visualization.loading,
  visualizationError: state.visualization.error,
  courseName: state.course.name,
  isOpen: state.plugin.isOpen
});

const mapDispatchToProps = dispatch => ({
  onReloadVisualization: () => dispatch(loadVisualization())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Plugin);
