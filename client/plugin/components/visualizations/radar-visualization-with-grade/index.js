import React from 'react';

import withClassPrefix from 'utils/class-prefix';
import RadarVisualization from 'components/visualizations/radar-visualization';
import GradeEstimateButton from 'components/visualizations/grade-estimate-button';

class RadarVisualizationWithGrade extends React.Component {
  render() {
    return (
      <div className={withClassPrefix('radar-visualization-with-grade')}>
        <RadarVisualization />
        <GradeEstimateButton />
      </div>
    );
  }
}

export default RadarVisualizationWithGrade;
