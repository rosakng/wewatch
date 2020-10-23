import * as ACTION_TYPES from 'store/movies/actions';

export const initialState = {
  // TODO: figure out how we want to format our movie data
  movies: {},
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case ACTION_TYPES.RESET_MOVIES: {
      return initialState;
    }
    case ACTION_TYPES.FETCH_MOVIES_REQUEST: {
      return {
        ...state,
      };
    }
    case ACTION_TYPES.FETCH_MOVIES_SUCCESS: {
      return {
        ...state,
      };
    }
    case ACTION_TYPES.FETCH_MOVIES_FAILURE: {
      return {
        ...state,
      };
    }
    default: {
      return state;
    }
  }
}
