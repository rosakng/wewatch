import { combineReducers } from 'redux';

import movies from 'store/movies/reducer';

const rootReducer = combineReducers({
  movies,
});

export default rootReducer;
