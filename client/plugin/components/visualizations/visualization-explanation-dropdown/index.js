import React from 'react';
import { connect } from 'react-redux';
import cn from 'classnames';
import { findDOMNode } from 'react-dom';
import prefix from 'react-prefixer';
import { TransitionMotion, spring } from 'react-motion';

import { toggleExplanation } from 'state/visualization';
import withClassPrefix from 'utils/class-prefix';
import Icon from 'components/icon';

export class VisualizationExplanationDropdown extends React.Component {

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
  }

  onOutsideClick(e) {
    const isOutside = e.target && !this.container.contains(e.target);

    if(isOutside && this.props.isOpen) {
      this.props.onToggle();
    }
  }

  renderContent({ opacity, scale }) {
    return (
      <div className={withClassPrefix('visualization-explanation__wrapper')} style={prefix({ opacity, transform: `scaleY(${scale})` })} key="explanation">
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
    const buttonClasses = withClassPrefix(cn({ 'btn-active': this.props.isOpen }, 'btn btn-primary btn-sm btn-circle pull-right'));

    return (
      <div className={withClassPrefix('visualization-explanation')} ref={node => this.container = node}>

        <div className={withClassPrefix('clearfix')}>
          <button className={buttonClasses} onClick={this.props.onToggle}>
            <Icon name="info"/>
          </button>
        </div>

        <TransitionMotion
          willLeave={() => ({ opacity: spring(0), scale: spring(0) })}
          willEnter={() => ({ opacity: 0, scale: 0 })}
          styles={
            this.props.isOpen
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

const mapStateToProps = state => ({
  isOpen: state.visualization.explanationIsOpen
});

const mapDispatchToProps = dispatch => ({
  onToggle: () => dispatch(toggleExplanation()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(VisualizationExplanationDropdown);
