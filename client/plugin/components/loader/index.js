import React from 'react';

import withClassPrefix from 'utils/class-prefix';

class Loader extends React.Component {
  render() {
    return (
      <div className={withClassPrefix('loader')}>
        <i className="fa fa-circle-o-notch fa-spin"></i>
      </div>
    );
  }
}

export default Loader;
