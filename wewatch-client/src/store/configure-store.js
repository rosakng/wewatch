import { createStore } from 'redux';
import rootReducer from 'store/RootReducer';

export default function configureStore(preloadedState) {
  const store = createStore(rootReducer, preloadedState);
  return store;
}
