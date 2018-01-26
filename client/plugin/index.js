try {
  require('babel-polyfill');
} catch(e) {
  console.log(e); // eslint-disable-line no-console
}

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import ReactHighcharts from 'react-highcharts';
import highchartsMore from 'highcharts/highcharts-more';

import './style';

import PluginLoader from 'components/plugin-loader';
import store from 'state/store';
import syncStudentDashboardWithStore from 'utils/sync-student-dashboard-with-store';
import withClassPrefix from 'utils/class-prefix';
import { CLASS_PREFIX } from 'utils/class-prefix';

highchartsMore(ReactHighcharts.Highcharts);

window.StudentDashboard = syncStudentDashboardWithStore(store, {
  onInitialize: initialize
});

function initialize() {
  const container = document.createElement('div');

  container.className = withClassPrefix('plugin-wrapper css-reset');

  document.querySelector('body').appendChild(container);

  render(
    <Provider store={store}>
      <PluginLoader/>
    </Provider>,
    container
  );
}
