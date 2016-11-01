import React from 'react';
import { connect } from 'react-redux';
import { TransitionMotion, spring } from 'react-motion';

import withClassPrefix from 'utils/class-prefix';
import { closeTutorial } from 'state/tutorial';

import Icon from 'components/icon';

export class TutorialModal extends React.Component {
  renderContent({ opacity, top }) {
    return (
      <div className={withClassPrefix('tutorial-modal')} key={'tutorialModal'}>
        <div className={withClassPrefix('tutorial-modal__layer')} style={{ opacity }}>
        </div>

        <div className={withClassPrefix('tutorial-modal__wrapper')}>
          <div className={withClassPrefix('tutorial-modal__container')} style={{ opacity, top }}>
            <div className={withClassPrefix('tutorial-modal__body')}>
              <div className={withClassPrefix('tutorial-modal__body-content')}>
                <p>
                  Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Sed posuere interdum sem. Quisque ligula eros ullamcorper quis, lacinia quis facilisis sed sapien. Mauris varius diam vitae arcu. Sed arcu lectus auctor vitae, consectetuer et venenatis eget velit. Sed augue orci, lacinia eu tincidunt et eleifend nec lacus. Donec ultricies nisl ut felis, suspendisse potenti. Lorem ipsum ligula ut hendrerit mollis, ipsum erat vehicula risus, eu suscipit sem libero nec erat. Aliquam erat volutpat. Sed congue augue vitae neque. Nulla consectetuer porttitor pede. Fusce purus morbi tortor magna condimentum vel, placerat id blandit sit amet tortor.
                </p>
              </div>
            </div>

            <div className={withClassPrefix('tutorial-modal__footer text-center')}>
              <button className={withClassPrefix('btn btn-success btn-icon')} onClick={this.props.onClose}>
                <Icon name="done"/>
                <span>Got it!</span>
              </button>
            </div>
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

const mapStateToProps = state => ({
  isOpen: state.tutorial.isOpen
});

const mapDispatchToProps = dispatch => ({
  onClose: () => dispatch(closeTutorial())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TutorialModal);
