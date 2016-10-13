import React from 'react';
import withClassPrefix from 'utils/class-prefix';

class Icon extends React.Component {
  render() {
    return (
      <i className={withClassPrefix('material-icons')}>{this.props.name}</i>
    );
  }
}

export default Icon;
