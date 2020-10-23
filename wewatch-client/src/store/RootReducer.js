import { combineReducers } from 'redux';

import moviesReducer from 'store/movies/reducer';

const rootReducer = combineReducers({
  moviesReducer,
});

export default rootReducer;
