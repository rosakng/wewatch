import React from 'react';
import Enzyme, { shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ReactDOM from 'react-dom';
import queryString from 'query-string';

import Lobby from '../Lobby';
import { BrowserRouter as Router } from "react-router-dom";

Enzyme.configure({ adapter: new Adapter() });

const location_for_host = queryString.stringify({
    search: {
      name: 'a_host',
      roomId: undefined,
      reset: undefined,
      oldRoomId: undefined,
    }
});

const location_for_user = queryString.stringify({
    search: {
      name: 'a_user',
      roomId: 'test',
      reset: undefined,
      oldRoomId: undefined,
    }
});

it("renders without crashing", ()=> {
    const div = document.createElement("div");
    ReactDOM.render(<Router><Lobby location="url/to/be/parsed"></Lobby></Router>, div);
})


describe('Render start session button when user is host', () => {
    const wrapper = shallow(
        <Lobby location={location_for_host} />
    );
    it('Renders button properly when user is host', () => {
        expect(wrapper.find('button').text()).toBe('Start Session');
    });
});

describe('Does not render start session button when user is host', () => {
    const wrapper = shallow(
        <Lobby location={location_for_host} />
    );
    it('Renders button properly when user is host', () => {
        expect(wrapper.contains('button')).toBe(false);
    });
});