import React from 'react';

import withClassPrefix from 'utils/class-prefix';

import './style';

class Loader extends React.Component {
  render() {
    return (<div className={withClassPrefix('loader')}>Loading...</div>);
  }
}

export default Loader;
