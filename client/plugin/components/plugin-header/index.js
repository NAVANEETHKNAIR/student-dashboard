import React from 'react';
import { connect } from 'react-redux';

import withClassPrefix from 'utils/class-prefix';

import { closePlugin } from 'state/plugin';

class PluginHeader extends React.Component {
  render() {
    return (
      <div className={withClassPrefix('plugin-header clearfix')}>
        <div className={withClassPrefix('plugin-header__wrapper')}>
          <div className={withClassPrefix('plugin-header__title p-r-1')}>
            {this.props.children}
          </div>

          <div className={withClassPrefix('plugin-header__actions clearfix')}>
            <button className={withClassPrefix('btn btn-sm btn-danger pull-right')} onClick={this.props.onClose}>
              <i className="material-icons">visibility_off</i>
            </button>
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  onClose: () => dispatch(closePlugin())
});

export default connect(
  null,
  mapDispatchToProps,
)(PluginHeader);
