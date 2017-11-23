import React from 'react';
import {TabNavigator, StackNavigator} from 'react-navigation';
import {Icon, Button} from "native-base";
import ProfileScreen from "../screens/profile/ProfileScreen";
import ChatsScreen from "../screens/chats/ChatsScreen";
import SearchScreen from "../screens/search/SearchScreen";

const profileNavigator = StackNavigator({
  Home: {
    screen: ProfileScreen,
    navigationOptions: {
      headerTitle: 'Profil',
    }
  }
});


const searchNavigator = StackNavigator({
  Home: {
    screen: SearchScreen,
    navigationOptions: {
      headerTitle: 'Suchen',
    }
  },

  Profile: {
    screen: ProfileScreen,
    navigationOptions: {
      headerTitle: 'Suchergebnis',
    }
  }
});


/**
 * Subnavigator that
 */
const chatsNavigator = StackNavigator({
  Home: {
    screen: ChatsScreen,
    navigationOptions: {
      headerTitle: 'Chats',
    }
  }
});

/**
 * Tab Navigation that contains the references to the components based above
 */
const RootTabs = TabNavigator({
    Profile: {
      screen: profileNavigator,
      navigationOptions: {
        tabBarLabel: 'Profil',
        tabBarIcon: <Icon ios='ios-person-outline' android='md-person' size={20}/>
      }
    },
    Chats: {
      screen: chatsNavigator,
      navigationOptions: {
        tabBarLabel: 'Nachrichten',
        tabBarIcon: <Icon ios='ios-text-outline' android='md-chatboxes' size={20}/>
      }

    },
    Settings: {
      screen: searchNavigator,
      navigationOptions: {
        tabBarLabel: 'Suchen',
        tabBarIcon: <Icon ios='ios-search-outline' android='md-search' size={20}/>
      }
    }
  }
);

export default RootTabs;