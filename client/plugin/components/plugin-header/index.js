import React from 'react';
import { connect } from 'react-redux';

import withClassPrefix from 'utils/class-prefix';

import { openTutorial } from 'state/tutorial';
import { closePlugin } from 'state/plugin';

import Icon from 'components/icon';

export class PluginHeader extends React.Component {
  renderCloseButton() {
    return (
      <button className={withClassPrefix('btn btn-sm btn-circle btn-danger pull-right')} onClick={this.props.onClose}>
        <Icon name="eye-slash"/>
      </button>
    );
  }

  renderTutorialButton() {
    const content = (
      <button className={withClassPrefix('btn btn-sm btn-circle btn-primary pull-right')} onClick={this.props.onOpenTutorial}>
        <Icon name="question"/>
      </button>
    );

    return !this.props.tutorialIsFinished
      ? content
      : null;
  }

  render() {
    return (
      <div className={withClassPrefix('plugin-header clearfix')}>
        <div className={withClassPrefix('plugin-header__wrapper')}>
          <div className={withClassPrefix('plugin-header__title p-r-1')}>
            {this.props.children}
          </div>

          <div className={withClassPrefix('plugin-header__actions clearfix')}>
            {this.renderCloseButton()}
            {this.renderTutorialButton()}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  tutorialIsFinished: state.user.tutorialFinished
});

const mapDispatchToProps = dispatch => ({
  onClose: () => dispatch(closePlugin()),
  onOpenTutorial: () => dispatch(openTutorial())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PluginHeader);
