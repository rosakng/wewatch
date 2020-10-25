export const FETCH_MOVIES_REQUEST = 'FETCH_MOVIES_REQUEST';
export const FETCH_MOVIES_SUCCESS = 'FETCH_MOVIES_SUCCESS';
export const FETCH_MOVIES_FAILURE = 'FETCH_MOVIES_FAILURE';

export const RESET_MOVIES = 'RESET_MOVIES';

// TODO: function that makes request to get all movies
export const fetchMovies = () => ({
  type: 'FETCH_MOVIES',
  CALL_API: {
    call: (api) => api.SOME_FUNCTION(),
    requestActionTypes: [
      FETCH_MOVIES_REQUEST,
      FETCH_MOVIES_SUCCESS,
      FETCH_MOVIES_FAILURE,
    ],
  },
});