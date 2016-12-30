import React from 'react';

import withClassPrefix from 'utils/class-prefix';

class ModalFooter extends React.Component {
  render() {
    return (
      <div className={withClassPrefix('modal__footer text-center')}>
        {this.props.children}
      </div>
    );
  }
}

export default ModalFooter;
