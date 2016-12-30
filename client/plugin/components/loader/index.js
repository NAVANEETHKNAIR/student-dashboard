import React from 'react';
import { spring, TransitionMotion } from 'react-motion';
import lget from 'lodash.get';

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

  renderLayerSpinner({ opacity }) {
    return (
      <div className={withClassPrefix('loader__layer')} style={{ opacity }}>
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

        <TransitionMotion
          willLeave={() => ({ opacity: spring(0) })}
          willEnter={() => ({ scale: 0, opacity: 0 })}
          styles={this.props.loading ? [{ key: 'loader', style: { opacity: spring(1) } }] : []}
        >
          {interpolated => {
            const style = lget(interpolated, '[0].style');

            return style
              ? this.renderLayerSpinner(style)
              : null;
          }}
        </TransitionMotion>
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
