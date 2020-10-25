import { applyMiddleware, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import rootReducer from 'store/RootReducer';
import withApi from 'store/ApiMiddleware';


export default function configureStore(preloadedState) {
  const store = createStore(rootReducer, preloadedState);
  return store;
}
