import { applyMiddleware, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import rootApi from 'store/RootApi';
import rootReducer from 'store/RootReducer';
import withApi from 'store/ApiMiddleware';


export default function configureStore(preloadedState) {
  const middlewares = [thunkMiddleware, withApi(rootApi)];
  const middlewareEnhancer = applyMiddleware(...middlewares);
  
  const composedEnhancers = composeWithDevTools(middlewareEnhancer);
  const store = createStore(rootReducer, preloadedState, composedEnhancers);

  return store;
}
