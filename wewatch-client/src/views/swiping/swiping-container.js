// TODO: flesh out container that will dispatch actions
import { useDispatch } from 'react-redux';

import fetchMovies from 'store/movies/actions'

const SwipingContainer = () => {
  const dispatch = useDispatch();
  dispatch(fetchMovies)

};

export default SwipingContainer;
