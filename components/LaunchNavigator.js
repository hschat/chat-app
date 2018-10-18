import React from 'react';
import { createStackNavigator } from 'react-navigation';
import { Icon } from 'native-base';

import SignupScreen from '../screens/launch/SignupScreen';
import LaunchScreen from '../screens/launch/LaunchScreen';
import LoginScreen from '../screens/launch/LoginScreen';

const Items = createStackNavigator({
  Launch: {
    screen: LaunchScreen,
  },
  Login: {
    screen: LoginScreen,
    navigationOptions: {
      headerTitle: 'Anmelden',
    },
  },
  Signup: {
    screen: SignupScreen,
    navigationOptions: {
      headerTitle: 'Registrieren',
    },
  },
});

export default Items;
