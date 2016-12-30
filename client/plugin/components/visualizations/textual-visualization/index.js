import React from 'react';
import { connect } from 'react-redux';
import cn from 'classnames';
import { Motion, spring } from 'react-motion';
import prefix from 'react-prefixer';

import withClassPrefix from 'utils/class-prefix';
import { selectActiveData } from 'selectors/visualization';
import { scrollTextual } from 'state/visualization';
import DefaultVisualizationExplanation from 'components/visualizations/default-visualization-explanation';
import Icon from 'components/icon';

class TextualVisualization extends React.Component {
  constructor() {
    super();

    this.state = {
      scrollTop: 0
    };

    this.hasBeenScrolled = false;
    this.onContentScroll = this.onContentScroll.bind(this);
    this.onScrollToBottom = this.onScrollToBottom.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.data !== this.props.data) {
      this.hasBeenScrolled = false;
    }
  }

  componentDidMount() {
    this.contentElem.scrollTop = 0;
    this.contentElem.addEventListener('scroll', this.onContentScroll);
  }

  onScrollToBottom() {
    this.contentElem.scrollTop = this.contentElem.scrollHeight;
  }

  onContentScroll() {
    if(!this.hasBeenScrolled) {
      this.props.onScroll();
      this.hasBeenScrolled = true;
    }

    this.setState({
      scrollTop: this.contentElem.scrollTop
    });
  }

  render() {
    const showScrollIndicator = this.state.scrollTop === 0;
    const contentClasses = cn({ 'textual-visualization__content--scroll-indicator': showScrollIndicator }, 'textual-visualization__content');

    return (
      <div className={withClassPrefix('textual-visualization')}>
        <div className={withClassPrefix(contentClasses)} ref={node => this.contentElem = node}>
          <DefaultVisualizationExplanation data={this.props.data} />
        </div>

        <Motion
          defaultStyle={{ scale: 0 }}
          style={{ scale: showScrollIndicator ? spring(1) : spring(0) }}
        >
          {interpolatedStyle => (
            <div
              className={withClassPrefix('textual-visualization__scroll-indicator')}
              style={prefix({ transform: `scale(${interpolatedStyle.scale}) translateX(-50%)` })}
              onClick={this.onScrollToBottom}
            >
              <Icon name="arrow-down" />
            </div>
          )}
        </Motion>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  data: selectActiveData(state)
});

const mapDispatchToProps = dispatch => ({
  onScroll: () => dispatch(scrollTextual()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TextualVisualization);
