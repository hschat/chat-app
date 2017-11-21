import React from 'react';
import {TabNavigator, StackNavigator} from 'react-navigation';
import {Icon, Text, Button} from "native-base";
import ProfileScreen from "../screens/ProfileScreen";
import ChatsScreen from "../screens/ChatsScreen";
import SettingsScreen from "../screens/SettingsScreen";

const profileNavigator = StackNavigator({

    home: {
        screen: ProfileScreen, navigationOptions: {
            headerTitle: 'Profil',
        }
    }
});

const RootTabs = TabNavigator({
        Profile: {
            screen: profileNavigator,
            navigationOptions: {
                tabBarLabel: 'Profil',
                tabBarIcon: <Icon ios='ios-person-outline' android='md-person' size={20}/>
            }
        },
        Chats: {
            screen: ChatsScreen,
            navigationOptions: {
                tabBarLabel: 'Nachrichten',
                tabBarIcon: <Icon ios='ios-text-outline' android='md-chatboxes' size={20}/>
            }

        },
        Settings: {
            screen: SettingsScreen,
            navigationOptions: {
                tabBarLabel: 'Einstellungen',
                tabBarIcon: <Icon ios='ios-settings-outline' android='md-settings' size={20}/>
            }
        }
    }
);

export default RootTabs;