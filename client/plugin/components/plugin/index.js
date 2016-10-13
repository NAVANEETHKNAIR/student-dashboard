import React from 'react';
import { connect } from 'react-redux';

import withClassPrefix from 'utils/class-prefix';
import { openTutorial } from 'state/tutorial';

import WeekSelector from 'components/week-selector';
import PluginHeader from 'components/plugin-header';
import Loader from 'components/loader';
import Visualization from 'components/visualizations/visualization';
import TutorialModal from 'components/tutorial-modal';
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

  render() {
    return (
      <div className={withClassPrefix('plugin css-reset')}>
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

        <TutorialModal/>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  onOpenTutorial: () => dispatch(openTutorial())
});

const mapStateToProps = state => ({
  visualizationLoading: state.visualization.loading,
  courseName: state.course.name,
  tutorialIsFinished: state.user.tutorialFinished
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Plugin);
