import React from 'react';
import { connect } from 'react-redux';

import withClassPrefix from 'utils/class-prefix';
import { openTutorial } from 'state/tutorial';

import WeekSelector from 'components/week-selector';
import PluginHeader from 'components/plugin-header';
import Loader from 'components/loader';
import Visualization from 'components/visualizations/visualization';
import TutorialModal from 'components/tutorial-modal';

class Plugin extends React.Component {
  renderVisualization() {
    return this.props.visualizationLoading
      ? <Loader/>
      : <Visualization/>;
  }

  renderTutorialButton() {
    const content = (
      <div className={withClassPrefix('text-center m-t-1')}>
        <button className={withClassPrefix('btn btn-success')} onClick={this.props.onOpenTutorial}>
          What's this?
        </button>
      </div>
    );

    return !this.props.tutorialIsFinished
      ? content
      : null;
  }

  render() {
    return (
      <div className={withClassPrefix('plugin')}>
        <PluginHeader>
          {this.props.courseName}
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
