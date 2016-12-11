import React from 'react';

import withClassPrefix from 'utils/class-prefix';
import TextualVisualization from 'components/visualizations/textual-visualization';
import GradeEstimateButton from 'components/visualizations/grade-estimate-button';

class TextualVisualizationWithGrade extends React.Component {
  render() {
    return (
      <div className={withClassPrefix('textual-visualization-with-grade')}>
        <div className={withClassPrefix('textual-visualization-with-grade__visualization')}>
          <TextualVisualization />
        </div>

        <GradeEstimateButton />
      </div>
    );
  }
}

export default TextualVisualizationWithGrade;
