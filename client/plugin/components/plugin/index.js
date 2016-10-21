import React from 'react';
import { connect } from 'react-redux';
import { TransitionMotion, spring } from 'react-motion';
import prefix from 'react-prefixer';

import withClassPrefix from 'utils/class-prefix';
import { openTutorial } from 'state/tutorial';

import WeekSelector from 'components/week-selector';
import PluginHeader from 'components/plugin-header';
import Loader from 'components/loader';
import Visualization from 'components/visualizations/visualization';
import Icon from 'components/icon';

class Plugin extends React.Component {
  renderVisualization() {
    return this.props.visualizationLoading
      ? <Loader/>
      : <Visualization/>;
  }

  renderTutorialButton() {
    const content = (
      <div className={withClassPrefix('text-center m-t-1')}>
        <button className={withClassPrefix('btn btn-success btn-icon')} onClick={this.props.onOpenTutorial}>
          <Icon name="help_outline"/>
          <span>What's this?</span>
        </button>
      </div>
    );

    return !this.props.tutorialIsFinished
      ? content
      : null;
  }

  renderContent(style) {
    return (
      <div className={withClassPrefix('plugin')} key='plugin' style={style}>
        <PluginHeader>
          My propgress in {this.props.courseName}
        </PluginHeader>

        <div className={withClassPrefix('divider')}></div>

        <div className={withClassPrefix('p-t-1')}>
          <WeekSelector/>
        </div>

        <div className={withClassPrefix('plugin__content')}>
          {this.renderVisualization()}
          {this.renderTutorialButton()}
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

const mapDispatchToProps = dispatch => ({
  onOpenTutorial: () => dispatch(openTutorial())
});

const mapStateToProps = state => ({
  visualizationLoading: state.visualization.loading,
  courseName: state.course.name,
  isOpen: state.plugin.isOpen,
  tutorialIsFinished: state.user.tutorialFinished
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Plugin);
