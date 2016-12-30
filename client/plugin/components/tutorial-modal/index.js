import React from 'react';
import { connect } from 'react-redux';

import withClassPrefix from 'utils/class-prefix';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'components/modal';
import { closeTutorial } from 'state/tutorial';
import { CHART_PRIMARY_COLOR, CHART_SECONDARY_COLOR } from 'constants/colors';
import { selectExerciseGroupOrder, selectActiveExerciseGroup } from 'selectors/plugin';
import { gradeEstimateTypes, radarVisualizationTypes, textualVisualizationTypes } from 'constants/visualizations';

import Icon from 'components/icon';

export class TutorialModal extends React.Component {
  renderBody() {
    return (
      <div>
        <p>
          This is a visualization of your progress in course {this.props.courseName} during exercise groups {this.props.exerciseGroups.join(', ')}.
        </p>

        {textualVisualizationTypes.includes(this.props.visualizationType) && this.renderTextualTutorial()}
        {radarVisualizationTypes.includes(this.props.visualizationType) && this.renderRadarTutorial()}

        <p>
          You can navigate between different exercise groups by pressing the arrow buttons (the <Icon name="chevron-left" /> and <Icon name="chevron-right" /> icons).
        </p>

        {gradeEstimateTypes.includes(this.props.visualizationType) && this.renderGradeEstimationTutorial()}
      </div>
    );
  }

  renderFooter() {
    return (
      <button className={withClassPrefix('btn btn-success btn-icon')} onClick={this.props.onClose}>
        <Icon name="check"/>
        {' '}
        <span>Got it!</span>
      </button>
    );
  }

  renderTextualTutorial() {
    return (
      <div>
        <p>
          Parameters on the list describe your progress in a certain area during the chosen exercise group. You can receive from 0 up to 10 points from each parameter. The points you've received is indicated by a progress bar next to the parameter's name. Below the parameter's name you'll find a short description what the parameter is measuring. The way your points are calculated is described below parameter's description.
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
          The <strong style={{ color: CHART_SECONDARY_COLOR }}>gray</strong> area of the radar consists of the average of the points received by all the students in the {this.props.courseName} course.
        </p>
      </div>
    );
  }

  renderGradeEstimationTutorial() {
    return (
      <p>
        To see your estimated grade for the course, press the "Estimate my grade" button (the button with <Icon name="graduation-cap" /> icon). Estimation is based on the average of points you've received from every parameter during the current exercise groups and the past exercise groups in this course.
      </p>
    );
  }

  render() {
    return (
      <Modal isOpen={this.props.isOpen} onClose={this.props.onClose}>
        <ModalHeader onClose={this.props.onClose}>
          How to use this visualization
        </ModalHeader>
        <ModalBody>
          {this.renderBody()}
        </ModalBody>
        <ModalFooter>
          {this.renderFooter()}
        </ModalFooter>
      </Modal>
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
