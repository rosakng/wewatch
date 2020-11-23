import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Match from 'components/Match/Match.js';
import { test_movie_data } from 'views/swiping/swiping-data';
import MovieDetail from 'views/swiping/movie-detail.js'; 

Enzyme.configure({ adapter: new Adapter() });

const location_for_host= {
  state: {
    isHost: true,
    name: 'swiper',
    roomId: 'roomId',
    matchedMovie: test_movie_data[0],
  }
}

const location_for_user= {
  state: {
    isHost: false,
    name: 'swiper',
    roomId: 'roomId',
    matchedMovie: test_movie_data[0],
  }
}

describe('Render Match Page with props when user is Host', () => {
  const wrapper = shallow(
    <Match location={location_for_host} />
  );

  it('Renders with the try again button when state has isHost=True', () => {
    expect(wrapper.containsMatchingElement(<MovieDetail />)).toBe(true);
    expect(wrapper.find('button').text()).toBe('Try Again');
  });
});

describe('Render Match Page with props when user is not Host', () => {
  const wrapper = shallow(
    <Match location={location_for_user} />
  );

  it('Renders with the try again button when state has isHost=False', () => {
    expect(wrapper.containsMatchingElement(<MovieDetail />)).toBe(true);
    expect(wrapper.contains('button')).toBe(false);
  });
});