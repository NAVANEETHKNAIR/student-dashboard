import React from 'react';

import withClassPrefix from 'utils/class-prefix';
import Icon from 'components/icon';

class Loader extends React.Component {
  renderSpinner() {
    const classes = [
      'fa fa fa-circle-o-notch fa-spin',
      withClassPrefix('loader__spinner')
    ].join(' ');

    return <i className={classes}></i>;
  }

  renderLayerSpinner() {
    return (
      <div className={withClassPrefix('loader__layer')}>
        {this.renderSpinner()}
      </div>
    );
  }

  renderWithChildren() {
    return (
      <div className={withClassPrefix('loader loader--with-children')}>
        <div className={withClassPrefix('loader__children')}>
          {this.props.children}
        </div>
        {this.props.loading && this.renderLayerSpinner()}
      </div>
    );
  }

  renderWithoutChildren() {
    return (
      <div className={withClassPrefix('loader loader--without-children')}>
        {this.renderSpinner()}
      </div>
    );
  }

  render() {
    return this.props.children
      ? this.renderWithChildren()
      : this.renderWithoutChildren();
  }
}

export default Loader;
