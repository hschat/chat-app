import React from 'react';
import {TabNavigator, StackNavigator} from 'react-navigation';
import {Icon, Button} from "native-base";
import ProfileScreen from "../screens/profile/ProfileScreen";
import ChatsScreen from "../screens/chats/ChatsScreen";
import SearchScreen from "../screens/search/SearchScreen";
import InviteScreen from "../screens/search/InviteScreen";
import ChatScreen from "../screens/chats/ChatScreen";
import CreateGroup from "../screens/chats/CreateGroupChat"

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

    View: {
        screen: ProfileScreen,
        navigationOptions: {
            headerTitle: 'Suchergebnis',
        }
    },
    Invite: {
        screen: InviteScreen,
        navigationOptions: {
            headerTitle: 'Einladen',
        }
    }
});

/**
 * a Navigator for the chats view e.g. navigate to Create a new Group or a chat screen
 */
const chatsNavigator = StackNavigator({
    Home: {
        screen: ChatsScreen,
        navigationOptions: {
            headerTitle: 'Chats',
        }
    },
    Chat: {
        screen: ChatScreen,
        navigationOptions: {
            tabBarVisible: false
        }
    },
    CreateGroup: {
        screen: CreateGroup,
        navigationOptions: {
            headerTitle: 'Gruppe erstellen',
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
        Search: {
            screen: searchNavigator,
            navigationOptions: {
                tabBarLabel: 'Suchen',
                tabBarIcon: <Icon ios='ios-search-outline' android='md-search' size={20}/>
            }
        }
    }
);

export default RootTabs;
