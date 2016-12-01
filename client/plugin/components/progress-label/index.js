import React from 'react';
import { Motion, spring } from 'react-motion';

import withClassPrefix from 'utils/class-prefix';

import './style';

class ProgressLabel extends React.Component {
  render() {
    return (
      <span className={withClassPrefix('progress-label')}>
        <Motion defaultStyle={{ x: 0 }} style={{ x: spring(this.props.progress) }}>
          {value => <span className={withClassPrefix('progress-label__progress')} style={{ width: `${value.x}%` }}></span>}
        </Motion>
        <span className={withClassPrefix('progress-label__label')}>{this.props.children}</span>
      </span>
    );
  }
}

export default ProgressLabel;
