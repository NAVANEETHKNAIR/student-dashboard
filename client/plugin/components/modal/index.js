import React from 'react';
import { TransitionMotion, spring } from 'react-motion';

import ModalHeader from './modal-header';
import ModalBody from './modal-body';
import ModalFooter from './modal-footer';
import Icon from 'components/icon';
import withClassPrefix from 'utils/class-prefix';

class Modal extends React.Component {
  renderContent({ opacity, top }) {
    return (
      <div className={withClassPrefix('modal')} key={'tutorialModal'}>
        <div className={withClassPrefix('modal__layer')} style={{ opacity }} onClick={this.props.onClose}>
        </div>

        <div className={withClassPrefix('modal__wrapper')}>
          <div className={withClassPrefix('modal__container')} style={{ opacity, top }}>
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <TransitionMotion
        willLeave={() => ({ opacity: spring(0), top: spring(0) })}
        willEnter={() => ({ opacity: 0, top: 0 })}
        styles={
          this.props.isOpen
            ? [{ key: 'tutorialModal', style: { opacity: spring(1), top: spring(100) } }]
            : []
        }
      >
        {interpolated => {
          return (
            <div>
              {interpolated.map(({ style }) => this.renderContent({
                top: `${style.top - 100}px`,
                opacity: style.opacity
              }))}
            </div>
          );
        }}
      </TransitionMotion>
    );
  }
}

export { Modal, ModalHeader, ModalBody, ModalFooter };
