import React from 'react';
import { connect } from 'react-redux';
import cn from 'classnames';

import withClassPrefix from 'utils/class-prefix';
import { selectActiveExerciseGroup } from 'selectors/plugin';
import { openGradeEstimate, closeGradeEstimate } from 'state/plugin';
import RadarVisualization from 'components/visualizations/radar-visualization';
import GradeEstimate from './grade-estimate';
import Icon from 'components/icon';

class RadarVisualizationWithGrade extends React.Component {
  state = {
    gradeIsOpen: false
  }

  renderGradeButton() {
    const buttonClasses = cn({ 'btn-active': this.state.gradeIsOpen }, 'btn btn-success');

    return (
      <div className={withClassPrefix('m-t-1 text-center')}>
        <GradeEstimate grade={this.props.estimatedGrade} isOpen={this.state.gradeIsOpen} onToggle={this.toggleGrade.bind(this)}/>

        <button className={withClassPrefix(buttonClasses)} onClick={this.toggleGrade.bind(this)}>
          <Icon name="graduation-cap"/> Estimate my grade
        </button>
      </div>
    );
  }

  toggleGrade() {
    const gradeIsOpen = !this.state.gradeIsOpen;

    if(gradeIsOpen) {
      this.props.onOpenEstimatedGrade();
    } else {
      this.props.onCloseEstimatedGrade();
    }

    this.setState({
      gradeIsOpen
    });
  }

  render() {
    return (
      <div className={withClassPrefix('radar-visualization-with-grade')}>
        <RadarVisualization/>
        {this.renderGradeButton()}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  estimatedGrade: state.visualization.data.estimatedGrade
});

const mapDispatchToProps = dispatch => ({
  onCloseEstimatedGrade: () => dispatch(closeGradeEstimate()),
  onOpenEstimatedGrade: () => dispatch(openGradeEstimate())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RadarVisualizationWithGrade);
