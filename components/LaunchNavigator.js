import React from 'react';
import { createStackNavigator } from 'react-navigation';
import { Icon } from 'native-base';
import i18n from '../translation/i18n';

import SignupScreen from '../screens/launch/SignupScreen';
import LaunchScreen from '../screens/launch/LaunchScreen';
import LoginScreen from '../screens/launch/LoginScreen';

const Items = createStackNavigator({
  Launch: {
    screen: LaunchScreen,
  },
  Login: {
    screen: LoginScreen,
    navigationOptions: ({ navigation }) => ({
      headerTitle: i18n.t('LaunchNavigator-SignIn'),
    }),
  },
  Signup: {
    screen: SignupScreen,
    navigationOptions: ({ navigation }) => ({
      headerTitle: i18n.t('LaunchNavigator-SignUp'),
    }),
  },
});

export default Items;