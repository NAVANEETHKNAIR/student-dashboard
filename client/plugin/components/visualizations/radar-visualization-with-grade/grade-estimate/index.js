import React from 'react';
import pick from 'lodash.pick';
import { findDOMNode } from 'react-dom';
import prefix from 'react-prefixer';
import { TransitionMotion, spring } from 'react-motion';

import withClassPrefix from 'utils/class-prefix';
import { PRIMARY_COLOR } from 'constants/colors';

import './style';

class GradeEstimate extends React.Component {
  
  static propTypes = {
    grade: React.PropTypes.number.isRequired,
    onToggle: React.PropTypes.func
  }

  renderContent(style, radius) {
    const STROKE_WIDTH = 8;
    const path = this.describeArc(30 - STROKE_WIDTH / 2, 30 - STROKE_WIDTH / 2, 30 - STROKE_WIDTH / 2, 0, radius);

    return (
      <div key='gradeEstimate' className={withClassPrefix('grade-estimate')}>
        <div className={withClassPrefix('grade-estimate__circle')} style={style} onClick={this.props.onToggle}>
          {this.props.grade}

          <svg className={withClassPrefix('grade-estimate__progress')}>
            <path fill='none' d={path} stroke={PRIMARY_COLOR} strokeWidth={STROKE_WIDTH} />
          </svg>
        </div>
      </div>
    );
  }

  polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    const angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;

    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  }

  describeArc(x, y, radius, startAngle, endAngle){
    const start = this.polarToCartesian(x, y, radius, endAngle);
    const end = this.polarToCartesian(x, y, radius, startAngle);

    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

    const d = [
      'M', start.x, start.y,
      'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(' ');

    return d;
  }

  render() {
    const bounceSpring = value => spring(value, { stiffness: 150, damping: 5 });

    return (
      <TransitionMotion
        willLeave={() => ({ scale: spring(0), opacity: spring(0), bottom: spring(0), radius: spring(0) })}
        willEnter={() => ({ scale: 0, opacity: 0, bottom: 0, radius: 0 })}
        styles={previousInterpolatedStyles => {
          const opacity = previousInterpolatedStyles && previousInterpolatedStyles[0]
            ? previousInterpolatedStyles[0].style.opacity
            : 0;

          let radius = spring(0);

          if(opacity > 0.9) {
            radius = bounceSpring(this.props.grade === 0 ? 0 : this.props.grade / 5 * 359.99);
          }

          return (this.props.isOpen ? [{ key: 'gradeEstimate', style: { scale: spring(1), opacity: spring(1), bottom: bounceSpring(90), radius } }] : []);
        }}
      >
        {interpolated => (
          <div>
            {interpolated.map(({ style }) => this.renderContent(prefix({ transform: `scale(${style.scale}) translateX(-50%) translateY(-${style.bottom}%)`, opacity: style.opacity }), Math.min(style.radius, 359.99)))}
          </div>
        )}
      </TransitionMotion>
    );
  }
}

GradeEstimate.propTypes = {
  grade: React.PropTypes.number.isRequired,
  onToggle: React.PropTypes.func
};

GradeEstimate.defaultProps = {
  onToggle: () => {}
};

export default GradeEstimate;
