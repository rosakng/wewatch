import * as ACTION_TYPES from 'store/movies/actions';

export const initialState = {
  // TODO: figure out how we want to format our movie data and flesh out this reducer
  movie_data: {},
  is_fetching_movies: false,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case ACTION_TYPES.RESET_MOVIES: {
      return initialState;
    }
    case ACTION_TYPES.FETCH_MOVIES_REQUEST: {
      return {
        ...state,
        is_fetching_movies: true,
      };
    }
    case ACTION_TYPES.FETCH_MOVIES_SUCCESS: {
      const { response } = action;

      return {
        ...state,
        is_fetching_movies: false,
        movie_data: response
      };
    }
    case ACTION_TYPES.FETCH_MOVIES_FAILURE: {
      return {
        ...state,
        is_fetching_movies: false
      };
    }
    default: {
      return state;
    }
  }
}
