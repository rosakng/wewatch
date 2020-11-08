import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import SwipingContainer from './swiping-container';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';

import MovieDetail from 'views/swiping/movie-detail.js'; 

import { test_movie_data } from 'views/swiping/swiping-data';
Enzyme.configure({ adapter: new Adapter() });

const location= {
  state: {
    roomId: 'roomId',
    topTenMovies: test_movie_data,
  }
}
describe('Render Swiping Container', () => {
  const wrapper = shallow(
    <SwipingContainer location={location} />
  );
  it('Renders the movie details component', () => {
    expect(wrapper.containsMatchingElement(<MovieDetail />)).toBe(true);
    expect(wrapper.find(MovieDetail).props().title).toBe('The Short Game');
    const like_button = wrapper.find(InsertEmoticonIcon);
    like_button.simulate('click');
    // expect(like_button.props().onClick()).toHaveBeenCalled()
    // expect(wrapper.find(MovieDetail).debug()).toBe('');
    // expect(wrapper.find(MovieDetail).props().title).toBe('The Short Game');
  });
});
