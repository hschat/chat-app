import React from 'react';
import { shallow } from 'enzyme';
import Enzyme from 'enzyme';
import configureStore from 'redux-mock-store';
import Adapter from 'enzyme-adapter-react-16';
import LoginScreen from '../components/message';

Enzyme.configure({ adapter: new Adapter() });

const middlewares = [];
const mockStore = configureStore(middlewares);

const context = {

};

const mockContextStore = mockStore(context);

describe('Testing Login', () => {
  it('renders correctly', () => {
    const wrapper = shallow(
      <LoginScreen />,
      { context: mockContextStore },
    );
    console.log(wrapper.instance());
    expect(wrapper).toMatchSnapshot();
  });
});
