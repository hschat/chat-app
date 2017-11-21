import React from 'react';
import { TabNavigator } from 'react-navigation';
import {Icon} from "native-base";
import ProfileScreen from "../screens/ProfileScreen";
import ChatsScreen from "../screens/ChatsScreen";
import SettingsScreen from "../screens/SettingsScreen";


const RootTabs = TabNavigator({
  Profile: {
    screen: ProfileScreen,
    navigationOptions: {
      headerTitle: 'Profil',
      tabBarLabel: 'Profil',
      tabBarIcon: () => {
        return <Icon ios='ios-person-outline' android='md-person' size={20}/>;
      }
    }
  },
  Chats: {
    screen: ChatsScreen,
    navigationOptions: {
      headerTitle: 'Nachrichten',
      tabBarLabel: 'Nachrichten',
      tabBarIcon: () => {
        return <Icon ios='ios-text-outline' android='md-chatboxes' size={20}/>;
      }
    }

  },
  Settings: {
    screen: SettingsScreen,
    navigationOptions: {
      headerTitle: 'Einstellungen',
      tabBarLabel: 'Einstellungen',
      tabBarIcon: () => {
        return <Icon ios='ios-settings-outline' android='md-settings' size={20}/>;
      }
    }
  }
});

export default RootTabs;