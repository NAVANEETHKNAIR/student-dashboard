import React from 'react';
import { connect } from 'react-redux';
import cn from 'classnames';
import { findDOMNode } from 'react-dom';

import { OPEN_EXPLANATION, CLOSE_EXPLANATION } from 'constants/actions';
import { createAction } from 'state/actions';
import withClassPrefix from 'utils/class-prefix';
import Icon from 'components/icon';

import './style';

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

  renderContent() {
    return (
      <div className={withClassPrefix('visualization-explanation__wrapper')}>
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
          <button className={buttonClasses} onClick={this.toggleExplanation.bind(this)}>
            <Icon name="info"/>
          </button>
        </div>

        {this.state.showExplanation && this.renderContent()}
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  onClose: () => dispatch(createAction({ name: CLOSE_EXPLANATION })),
  onOpen: () => dispatch(createAction({ name: OPEN_EXPLANATION }))
});

export default connect(
  null,
  mapDispatchToProps,
)(VisualizationExplanation);
