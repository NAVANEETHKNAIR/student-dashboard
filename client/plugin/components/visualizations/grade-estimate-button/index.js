import React from 'react';
import { connect } from 'react-redux';
import cn from 'classnames';

import withClassPrefix from 'utils/class-prefix';
import { openGradeEstimate, closeGradeEstimate } from 'state/visualization';
import GradeEstimate from 'components/visualizations/grade-estimate';
import Icon from 'components/icon';

class GradeEstimateButton extends React.Component {
  constructor() {
    super();

    this.state = {
      gradeIsOpen: false
    };

    this.onToggleGrade = this.onToggleGrade.bind(this)
  }

  render() {
    const buttonClasses = cn({ 'btn-active': this.state.gradeIsOpen }, 'btn btn-success');

    return (
      <div className={withClassPrefix('m-t-1 text-center')}>
        <GradeEstimate grade={this.props.estimatedGrade} isOpen={this.state.gradeIsOpen} onToggle={this.onToggleGrade}/>

        <button className={withClassPrefix(buttonClasses)} onClick={this.onToggleGrade}>
          <Icon name="graduation-cap"/> Estimate my grade
        </button>
      </div>
    );
  }

  onToggleGrade() {
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
)(GradeEstimateButton);
