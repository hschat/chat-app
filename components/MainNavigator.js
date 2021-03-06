import React from 'react';
import {createStackNavigator, createBottomTabNavigator, createAppContainer} from 'react-navigation';
import {Icon, Button} from 'native-base';
import ProfileScreen from '../screens/profile/ProfileScreen';
import ChatsScreen from '../screens/chats/ChatsScreen';
import SearchScreen from '../screens/search/SearchScreen';
import InviteScreen from '../screens/search/InviteScreen';
import ChatInfo from '../screens/chats/ChatInfo';
import ChatGroupInfo from '../screens/chats/ChatGroupInfo';
import ChatGroupProfile from '../screens/chats/ChatGroupProfile';
import ChatScreen from '../screens/chats/ChatScreen';
import CreateGroup from '../screens/chats/CreateGroupChat';
import FeedbackScreen from '../screens/feedback/FeedbackScreen';
import UserSettingsScreen from '../screens/profile/UserSettingsScreen';
import AddMember from '../screens/search/SearchScreenAddMember';
import i18n from '../translation/i18n';

const profileNavigator = createStackNavigator({
    Home: {
        screen: ProfileScreen,
        defaultNavigationOptions: ({ navigation }) => ({
            headerTitle: i18n.t('MainNavigator-Profil'),
        }),
    },
    View: {
        screen: UserSettingsScreen,
        defaultNavigationOptions: ({ navigation }) => ({
            headerTitle: i18n.t('MainNavigator-Settings'),
        }),
    },
});

const searchNavigator = createStackNavigator({
    Home: {
        screen: SearchScreen,
        defaultNavigationOptions: ({ navigation }) => ({
            headerTitle: i18n.t('MainNavigator-Search'),
        }),
    },

    View: {
        screen: ProfileScreen,
        defaultNavigationOptions: ({ navigation }) => ({
            headerTitle: i18n.t('MainNavigator-SearchResult'),
        }),
    },
    Invite: {
        screen: InviteScreen,
        defaultNavigationOptions: ({ navigation }) => ({
            headerTitle: i18n.t('MainNavigator-Invite'),
        }),
    },
    InfoGroup: {
        screen: ChatGroupInfo,
    },
    GroupProfile: {
        screen: ChatGroupProfile,
    },
});

/**
 * a Navigator for the chats view e.g. navigate to Create a new Group or a chat screen
 */
const chatsNavigator = createStackNavigator({
    Home: {
        screen: ChatsScreen,
        defaultNavigationOptions: ({ navigation }) => ({
            headerTitle: i18n.t('MainNavigator-Chats'),
        }),
    },
    Chat: {
        screen: ChatScreen,
        defaultNavigationOptions: ({ navigation }) => ({
            tabBarVisible: false,
        }),
    },
    CreateGroup: {
        screen: CreateGroup,
        defaultNavigationOptions: ({ navigation }) => ({
            headerTitle: i18n.t('MainNavigator-CreateGroup'),
        }),
    },
    View: {
        screen: ProfileScreen,
        defaultNavigationOptions: ({ navigation }) => ({
            headerTitle: i18n.t('MainNavigator-Profil'),
        }),
    },
    AddMember: {
        screen: AddMember,
        defaultNavigationOptions: ({ navigation }) => ({
            headerTitle: i18n.t('MainNavigator-AddMember'),
        }),
    },
    InfoGroup: {
        screen: ChatGroupInfo,
    },
    Info: {
        screen: ChatInfo,
    },
});

const feedbackNavigator = createStackNavigator({
    Home: {
        screen: FeedbackScreen,
        defaultNavigationOptions: ({ navigation }) => ({
            headerTitle: i18n.t('MainNavigator-Feedback'),
        }),
    },
});

/**
 * Tab Navigation that contains the references to the components based above
*/
const RootTabs = createBottomTabNavigator({
    Profile: {
        screen: profileNavigator,
        defaultNavigationOptions: ({ navigation }) => ({
            tabBarLabel: i18n.t('MainNavigator-BottomProfil'),
            tabBarIcon: <Icon ios="ios-person-outline" android="md-person" size={20}/>,
        }),
    },
    Chats: {
        screen: chatsNavigator,
        defaultNavigationOptions: ({ navigation }) => ({
            tabBarLabel: i18n.t('MainNavigator-BottomMessage'),
            tabBarIcon: <Icon ios="ios-text-outline" android="md-chatboxes" size={20}/>,
        }),

    },
    Search: {
        screen: searchNavigator,
        defaultNavigationOptions: ({ navigation }) => ({
            tabBarLabel: i18n.t('MainNavigator-BottomSearch'),
            tabBarIcon: <Icon ios="ios-search-outline" android="md-search" size={20}/>,
        }),
    },
    Feedback: {
        screen: feedbackNavigator,
        defaultNavigationOptions: ({ navigation }) => ({
            tabBarLabel: i18n.t('MainNavigator-BottomFeedback'),
            tabBarIcon: <Icon size={20} name="ios-information-circle-outline"/>,
        }),
    },


});

const appContainer = createAppContainer(RootTabs);

export default appContainer;
