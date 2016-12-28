import React from 'react';
import { connect } from 'react-redux';
import { TransitionMotion, spring } from 'react-motion';

import withClassPrefix from 'utils/class-prefix';
import { closeTutorial } from 'state/tutorial';
import { CHART_PRIMARY_COLOR, CHART_SECONDARY_COLOR } from 'constants/colors';
import { selectExerciseGroupOrder, selectActiveExerciseGroup } from 'selectors/plugin';
import { gradeEstimateTypes, radarVisualizationTypes, textualVisualizationTypes } from 'constants/visualizations';

import Icon from 'components/icon';

export class TutorialModal extends React.Component {
  renderContent({ opacity, top }) {
    return (
      <div className={withClassPrefix('tutorial-modal')} key={'tutorialModal'}>
        <div className={withClassPrefix('tutorial-modal__layer')} style={{ opacity }}>
        </div>

        <div className={withClassPrefix('tutorial-modal__wrapper')}>
          <div className={withClassPrefix('tutorial-modal__container')} style={{ opacity, top }}>
            <div className={withClassPrefix('tutorial-modal__body')}>
              <div className={withClassPrefix('tutorial-modal__body-content')}>
                <p>
                  This is a visualization of your progress in course {this.props.courseName} during exercise weeks {this.props.exerciseGroups.join(', ')}.
                </p>

                {textualVisualizationTypes.includes(this.props.visualizationType) && this.renderTextualTutorial()}
                {radarVisualizationTypes.includes(this.props.visualizationType) && this.renderRadarTutorial()}

                <p>
                  You can navigate between different exercise weeks by pressing the arrow buttons (the <Icon name="chevron-left" /> and <Icon name="chevron-right" /> icons).
                </p>

                {gradeEstimateTypes.includes(this.props.visualizationType) && this.renderGradeEstimationTutorial()}
              </div>
            </div>

            <div className={withClassPrefix('tutorial-modal__footer text-center')}>
              <button className={withClassPrefix('btn btn-success btn-icon')} onClick={this.props.onClose}>
                <Icon name="check"/>
                {' '}
                <span>Got it!</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderTextualTutorial() {
    return (
      <div>
        <p>
          Parameters on the list describe your progress in a certain area during the chosen exercise week. You can receive from 0 up to 10 points from each parameter. The points you've received is indicated by a progress bar next to the parameter's name. Below the parameter's name you'll find a short description what the parameter is measuring. The way your points are calculated is described below parameter's description.
        </p>
      </div>
    );
  }

  renderRadarTutorial() {
    return (
      <div>
        <p>
          The <strong style={{ color: CHART_PRIMARY_COLOR }}>blue</strong> area of the radar consists of the points you've received during {this.props.activeExerciseGroup} from the parameters around the radar.
          You can get from 0 up to 10 points from each parameter. The bigger the blue area is, the better you're doing.
          Press the "info" button (the button with <Icon name="info" /> icon) above the radar to see what the parameters mean and how they are calculated.
        </p>

        <p>
          The <strong style={{ color: CHART_SECONDARY_COLOR }}>gray</strong> area of the radar consists of your overall average of the points you've received during all the exercise weeks.
        </p>
      </div>
    );
  }

  renderGradeEstimationTutorial() {
    return (
      <p>
        To see your estimated grade for the course, press the "Estimate my grade" button (the button with <Icon name="graduation-cap" /> icon). Estimation is based on the average of points you've received from every parameter during the current exercise week and the past exercise weeks in this course. 
      </p>
    );
  }

  render() {
    return (
      <TransitionMotion
        willLeave={() => ({ opacity: spring(0), top: spring(0) })}
        willEnter={() => ({ opacity: 0, top: 0 })}
        styles={
          this.props.isOpen
            ? [{ key: 'tutorialModal', style: { opacity: spring(1), top: spring(100) } }]
            : []
        }
      >
        {interpolated => {
          return (
            <div>
              {interpolated.map(({ style }) => this.renderContent({
                top: `${style.top - 100}px`,
                opacity: style.opacity
              }))}
            </div>
          );
        }}
      </TransitionMotion>
    );
  }
}

const mapStateToProps = state => ({
  isOpen: state.tutorial.isOpen,
  courseName: state.course.name,
  exerciseGroups: selectExerciseGroupOrder(state),
  activeExerciseGroup: selectActiveExerciseGroup(state),
  visualizationType: state.visualization.type
});

const mapDispatchToProps = dispatch => ({
  onClose: () => dispatch(closeTutorial())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TutorialModal);
