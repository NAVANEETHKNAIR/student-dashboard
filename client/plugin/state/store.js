import { createStore, applyMiddleware } from 'redux';

import thunk from 'redux-thunk';
import axiosMiddleware from 'redux-axios-middleware';

import reducer from './reducer';

import actionDispatcherMiddleware from 'middlewares/actions';
import axiosClient from 'utils/axios-client';
import { accessTokenInterceptor } from 'utils/axios-interceptors';

const axiosOptions = {
  interceptors: {
    request: [accessTokenInterceptor]
  }
}

export default createStore(
  reducer,
  applyMiddleware(thunk, actionDispatcherMiddleware, axiosMiddleware(axiosClient, axiosOptions))
);
