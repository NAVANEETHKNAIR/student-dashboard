import React from 'react';
import { connect } from 'react-redux';

import { selectIsVisible } from 'selectors/notification';
import withClassPrefix from 'utils/class-prefix';
import Icon from 'components/icon';

class Notification extends React.Component {
  render() {
    const content = this.props.isVisible
      ? (
        <div className={withClassPrefix('notification')}>
          <Icon name="bell" />
        </div>
      )
      : null;

    return content;
  }
}

const mapStateToProps = state => ({
  isVisible: selectIsVisible(state)
});

export default connect(
  mapStateToProps
)(Notification);
