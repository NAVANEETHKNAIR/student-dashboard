import React from 'react';
import withClassPrefix from 'utils/class-prefix';

class Icon extends React.Component {
  render() {
    return (
      <i className={`fa fa-${this.props.name}`}></i>
    );
  }
}

export default Icon;
