import React from 'react';
import {StackNavigator} from 'react-navigation';
import {Icon} from "native-base";

import SignupScreen from "../screens/SignupScreen";
import LaunchScreen from "../screens/LaunchScreen";
import LoginScreen from "../screens/LoginScreen";

const Items = StackNavigator({
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