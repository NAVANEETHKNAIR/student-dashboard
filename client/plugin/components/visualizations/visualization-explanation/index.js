import React from 'react';
import { connect } from 'react-redux';
import cn from 'classnames';
import { findDOMNode } from 'react-dom';

import { OPEN_EXPLANATION, CLOSE_EXPLANATION } from 'constants/actions';
import { createAction } from 'state/actions';
import withClassPrefix from 'utils/class-prefix';

class VisualizationExplanation extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showExplanation: false
    }

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
    const buttonClasses = cn({ [withClassPrefix('btn-active')]: this.state.showExplanation }, withClassPrefix('btn btn-primary btn-sm pull-right'));

    return (
      <div className={withClassPrefix('visualization-explanation')} ref="container">
        <div className={withClassPrefix('clearfix')}>
          <button className={buttonClasses} onClick={this.toggleExplanation.bind(this)}>
            <i className="material-icons">info_outline</i>
          </button>
        </div>

        {this.state.showExplanation && this.renderContent()}
      </div>
    );
  }
}

VisualizationExplanation.propTypes = {
  onClose: React.PropTypes.func,
  onOpen: React.PropTypes.func
};

const mapDispatchToProps = dispatch => ({
  onClose: () => dispatch(createAction({ name: CLOSE_EXPLANATION })),
  onOpen: () => dispatch(createAction({ name: OPEN_EXPLANATION }))
});

export default connect(
  null,
  mapDispatchToProps,
)(VisualizationExplanation);
