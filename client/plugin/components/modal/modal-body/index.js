import React from 'react';

import withClassPrefix from 'utils/class-prefix';

class ModalBody extends React.Component {
  render() {
    return (
      <div className={withClassPrefix('modal__body')}>
        <div className={withClassPrefix('modal__body-content')}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default ModalBody;
