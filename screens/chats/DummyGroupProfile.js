import React, {Component} from 'react';
import {
    Text,
    View,
    Button,
    H3,
    Icon,
    Item,
    ListItem,
    Content,
    Label,
    Input,
    Form,
    CheckBox,
    List,
    Body,
    Left,
    Right,
    Spinner,
    Switch,
    Toast,
    Thumbnail
} from "native-base";
import {StyleSheet, Image, Alert, Dimensions, TouchableOpacity} from 'react-native';
import TimeAgo from '../../components/TimeAgo';
import BaseStyles from '../../baseStyles';
import Distance from '../../components/Distance'
import ModalInput from '../../components/ModalWithInput'
import {NavigationActions, SafeAreaView} from 'react-navigation';
import i18n from '../../translation/i18n';


const styles = StyleSheet.create({
    image: {
        height: 100,
        borderRadius: 50,
        width: 100,
    },
    header: {
        fontWeight: 'bold'
    },
    subheader: {
        color: '#999999'
    },
    middle: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    left: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    roundedIcon: {
        backgroundColor: '#ff3232',
        padding: 10,
        borderRadius: 100,
        width: 47,
        height: 47,
    },
    item: {
        borderBottomWidth: 0,
    }
});


export default class DummyGroupProfile extends Component {

    static navigationOptions = ({navigation, screenProps}) => {
        // No logout button for other profiles
        if (navigation.state.hasOwnProperty("params") && navigation.state.params !== undefined) return {};
        return {
            headerLeft: (
                <Button onPress={() => {
                    navigation.navigate('View', {ProfileScreen: screenProps.ProfileScreen});
                }} transparent><Icon
                    name="ios-settings"/></Button>
            ),
        }
    };

    constructor(props) {
        super(props);

        this.state = {
            showPasswordModal: false,
            password: '',
        };
        this.store = this.props.screenProps.store;
    }

    toastIt = (text, type) => {
        Toast.show({
            text: text,
            position: 'top',
            textStyle: {flex: 1, textAlign: 'center'},
            type: type,
            duration: 2000
        })
    };

    checkPassword = (password) =>{
        let currentChat = this.props.navigation.state.params.chat;
        let currentUser = this.store.user;
        if(currentChat.selfmanaged_password === password){
            this.store.enterWithUserGroupPassword(currentChat,currentUser);
            this.toastIt('Gruppe beigetreten','success');
            this.hidePasswordModal();
            return;
        }
        this.toastIt('Passwort inkorrekt','warning');
        this.hidePasswordModal();
        return;
        
    };

    showPasswordModal = () =>{
        this.setState({showPasswordModal: true})
    };

    hidePasswordModal = () =>{
        this.setState({showPasswordModal: false})
    };
    
    render() {

        return (
            <View>
                <Text>BlahBlahBlah...</Text>
                <ModalInput
                    text='Bitte gib das Passwort ein'
                    placeholder='Passwort...'
                    visible={this.state.showPasswordModal}
                    input={this.state.password}
                    positiv={this.checkPassword}
                    negativ={this.hidePasswordModal}
                    maxLength={99}
                />
                <Button transparent danger onPress={this.showPasswordModal}><Text>!Beitreten!</Text></Button>
            </View>
        );
    }
}
