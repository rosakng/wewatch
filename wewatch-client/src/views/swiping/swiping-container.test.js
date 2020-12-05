import React from 'react';
import SwipingContainer from './swiping-container';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';

import MovieDetail from 'views/swiping/movie-detail.js'; 

import { test_movie_data } from 'views/swiping/swiping-data';
Enzyme.configure({ adapter: new Adapter() });

const location= {
  state: {
    isHost: true,
    name: 'swiper',
    roomId: 'roomId',
    topTenMovies: test_movie_data,
  }
}
describe('Render Swiping Container with props', () => {
  const wrapper = shallow(
    <SwipingContainer location={location} />
  );
  it('Contains like button functionality and renders the movie details component with correct movie details', () => {
    expect(wrapper.containsMatchingElement(<MovieDetail />)).toBe(true);
    expect(wrapper.find(MovieDetail).props().title).toBe('The Short Game');
    expect(wrapper.containsMatchingElement(<InsertEmoticonIcon />)).toBe(true);
    const like_button = wrapper.find(InsertEmoticonIcon);
    like_button.simulate('click');
    wrapper.update();
  });
});
