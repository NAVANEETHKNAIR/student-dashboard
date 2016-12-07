import React from 'react';
import { connect } from 'react-redux';
import cn from 'classnames';
import { findDOMNode } from 'react-dom';
import prefix from 'react-prefixer';
import { TransitionMotion, spring } from 'react-motion';

import { openExplanation, closeExplanation } from 'state/plugin';
import withClassPrefix from 'utils/class-prefix';
import Icon from 'components/icon';

export class VisualizationExplanation extends React.Component {

  static propTypes = {
    onClose: React.PropTypes.func,
    onOpen: React.PropTypes.func
  }

  state = {
    showExplanation: false
  }

  constructor() {
    super();

    this.onOutsideClick = this.onOutsideClick.bind(this);
    this.toggleExplanation = this.toggleExplanation.bind(this);
  }

  toggleExplanation() {
    const { showExplanation } = this.state;

    if(showExplanation) {
      this.props.onClose();
    } else {
      this.props.onOpen();
    }

    this.setState({
      showExplanation: !showExplanation
    });
  }

  onOutsideClick(e) {
    const container = findDOMNode(this.refs.container);
    const isInside = e.target === container || container.contains(e.target);

    if(!isInside) {
      if(this.state.showExplanation === true) {
        this.props.onClose();
      }

      this.setState({
        showExplanation: false
      });
    }
  }

  renderContent({ opacity, scale }) {
    return (
      <div className={withClassPrefix('visualization-explanation__wrapper')} style={prefix({ opacity, transform: `scaleY(${scale})` })}>
        <div className={withClassPrefix('visualization-explanation__container')}>
          <div className={withClassPrefix('visualization-explanation__content')}>
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }

  componentDidMount() {
    document.addEventListener('click', this.onOutsideClick);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.onOutsideClick);
  }

  render() {
    const buttonClasses = withClassPrefix(cn({ 'btn-active': this.state.showExplanation }, 'btn btn-primary btn-sm btn-circle pull-right'));

    return (
      <div className={withClassPrefix('visualization-explanation')} ref="container">
        <div className={withClassPrefix('clearfix')}>
          <button className={buttonClasses} onClick={this.toggleExplanation}>
            <Icon name="info"/>
          </button>
        </div>

        <TransitionMotion
          willLeave={() => ({ opacity: spring(0), scale: spring(0) })}
          willEnter={() => ({ opacity: 0, scale: 0 })}
          styles={
            this.state.showExplanation
              ? [{ key: 'explanation', style: { opacity: spring(1), scale: spring(1) } }]
              : []
          }
        >
          {interpolated => {
            return (
              <div className={withClassPrefix('visualization-explanation__motion-wrapper')}>
                {interpolated.map(({ style }) => this.renderContent({
                  scale: `${style.scale}`,
                  opacity: style.opacity
                }))}
              </div>
            );
          }}
        </TransitionMotion>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  onClose: () => dispatch(closeExplanation()),
  onOpen: () => dispatch(openExplanation())
});

export default connect(
  null,
  mapDispatchToProps,
)(VisualizationExplanation);
