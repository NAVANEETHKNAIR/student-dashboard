import React from 'react';
import omit from 'lodash.omit';

import withClassPrefix from 'utils/class-prefix';

class Icon extends React.Component {
  render() {
    return (
      <i className={`fa fa-${this.props.name} ${this.props.className || ''}`} {...omit(this.props, ['className'])}></i>
    );
  }
}

export default Icon;
