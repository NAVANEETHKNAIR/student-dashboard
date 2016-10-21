import React from 'react';
import { connect } from 'react-redux';
import { TransitionMotion, spring } from 'react-motion';
import cn from 'classnames';
import moment from 'moment';
import prefix from 'react-prefixer';

import withClassPrefix from 'utils/class-prefix';

import { goToNextExerciseGroup, goToPrevExerciseGroup } from 'state/plugin';
import { selectActiveExerciseGroup, selectActiveIsLastExerciseGroup, selectActiveIsFirstExerciseGroup, selectActiveExerciseGroupDateInterval  } from 'selectors/plugin';

import Icon from 'components/icon';

class WeekSelector extends React.Component {
  constructor() {
    super();

    this.state = {
      direction: 1
    };
  }

  onNext() {
    !this.props.nextDisabled && this.props.onNext();
  }

  onPrev() {
    !this.props.prevDisabled && this.props.onPrev();
  }

  componentWillReceiveProps(nextProps) {
    const [startNow,] = this.props.dateInterval;
    const [startNext,] = nextProps.dateInterval;

    this.setState({
      direction: startNext - startNow >= 0 ? 1 : -1
    });
  }

  renderNext() {
    return (
      <div className={cn(withClassPrefix('week-selector__action'), { [withClassPrefix('disabled')]: this.props.nextDisabled })} onClick={this.onNext.bind(this)}>
        <Icon name="keyboard_arrow_right"/>
      </div>
    );
  }

  renderPrev() {
    return (
      <div className={cn(withClassPrefix('week-selector__action'), { [withClassPrefix('disabled')]: this.props.prevDisabled })} onClick={this.onPrev.bind(this)}>
        <Icon name="keyboard_arrow_left"/>
      </div>
    );
  }

  renderLabel() {
    const [start, end] = this.props.dateInterval;
    const format = 'DD.MM.YYYY';
    const { direction } = this.state;

    return (
      <TransitionMotion
        willLeave={({ data }) => {
          const leaveDirection = data.start - start;
          const left = leaveDirection >= 0
            ? spring(100)
            : spring(-100);

          return { opacity: spring(0), left };
        }}
        willEnter={() => ({ opacity: 0, left: direction * 100 })}
        styles={[{ key: `weekLabel-${start}`, style: { opacity: spring(1), left: spring(0) }, data: { label: this.props.label, start, end } }]}
      >
        {interpolated => (
          <div className={withClassPrefix('week-selector__current')}>
            {interpolated.map(({ style, key, data }) => {
              return (
                <div key={key} style={prefix({ opacity: style.opacity, transform: `translateX(${style.left}%)` })} className={withClassPrefix('week-selector__label')}>
                  {data.label}
                  <div className={withClassPrefix('week-selector__date-interval text-muted')}>
                    {moment.utc(data.start).format(format)} - {moment.utc(data.end).format(format)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </TransitionMotion>
    )
  }

  render() {
    return (
      <div className={withClassPrefix('week-selector')}>
        {this.renderPrev()}
        {this.renderLabel()}
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
