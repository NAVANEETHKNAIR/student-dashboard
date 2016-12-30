import React from 'react';

import withClassPrefix from 'utils/class-prefix';
import Icon from 'components/icon';

class ModalHeader extends React.Component {
  render() {
    return (
      <div className={withClassPrefix('modal__header')}>
        {this.props.children}
        <Icon
          name="times"
          className={withClassPrefix('modal__close')}
          onClick={this.props.onClose}
        />
      </div>
    );
  }
}

export default ModalHeader;
