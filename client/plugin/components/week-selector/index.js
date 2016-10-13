import React from 'react';
import { connect } from 'react-redux';
import cn from 'classnames';
import moment from 'moment';

import withClassPrefix from 'utils/class-prefix';

import { goToNextExerciseGroup, goToPrevExerciseGroup } from 'state/plugin';
import { selectActiveExerciseGroup, selectActiveIsLastExerciseGroup, selectActiveIsFirstExerciseGroup, selectActiveExerciseGroupDateInterval  } from 'selectors/plugin';

class WeekSelector extends React.Component {
  onNext() {
    !this.props.nextDisabled && this.props.onNext();
  }

  onPrev() {
    !this.props.prevDisabled && this.props.onPrev();
  }

  renderNext() {
    return (
      <div className={cn(withClassPrefix('week-selector__action'), { [withClassPrefix('disabled')]: this.props.nextDisabled })} onClick={this.onNext.bind(this)}>
        <i className="material-icons">keyboard_arrow_right</i>
      </div>
    );
  }

  renderPrev() {
    return (
      <div className={cn(withClassPrefix('week-selector__action'), { [withClassPrefix('disabled')]: this.props.prevDisabled })} onClick={this.onPrev.bind(this)}>
        <i className="material-icons">keyboard_arrow_left</i>
      </div>
    );
  }

  render() {
    const [start, end] = this.props.dateInterval;
    const format = 'DD.MM.YYYY';

    return (
      <div className={withClassPrefix('week-selector')}>
        {this.renderPrev()}
        <div className={withClassPrefix('week-selector__current')}>
          {this.props.label}
          <div className={withClassPrefix('week-selector__date-interval text-muted')}>
            {moment(start * 1000).format(format)} - {moment(end * 1000).format(format)}
          </div>
        </div>
        {this.renderNext()}
      </div>
    );
  }
}

WeekSelector.propTypes = {
  label: React.PropTypes.string.isRequired,
  nextDisabled: React.PropTypes.bool,
  prevDisabled: React.PropTypes.bool,
  onNext: React.PropTypes.func,
  onPrev: React.PropTypes.func
};

WeekSelector.defaultProps = {
  nextDisabled: false,
  prevDisabled: false
};

const mapStateToProps = state => ({
  label: selectActiveExerciseGroup(state),
  dateInterval: selectActiveExerciseGroupDateInterval(state),
  prevDisabled: selectActiveIsFirstExerciseGroup(state),
  nextDisabled: selectActiveIsLastExerciseGroup(state)
});

const mapDispatchToProps = dispatch => ({
  onNext: () => dispatch(goToNextExerciseGroup()),
  onPrev: () => dispatch(goToPrevExerciseGroup())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WeekSelector);
