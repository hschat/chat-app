import React from 'react';
import {KeyboardAvoidingView, TextInput, StyleSheet, View, AsyncStorage, Text, Image, Alert} from 'react-native';
import {Body, Button, Container, Icon, Left, List, ListItem, Right, Thumbnail, Spinner} from 'native-base'
import {GiftedChat} from 'react-native-gifted-chat';
import {NavigationActions} from 'react-navigation';

import Message from '../../components/message'
import TimeAgo from "../../components/TimeAgo";
import ApiStore from '../../ApiStore'


const styles = StyleSheet.create({
    input: {
        height: 35,
        borderColor: 'gray',
        borderWidth: 1,
        marginLeft: 6,
        marginRight: 6,
        marginTop: 2,
        marginBottom: 2,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        width: '90%',
        flex: 1
    },
    navBar: {
        paddingTop: 20,
        height: 40,
        backgroundColor: '#d80030'
    },
    inputWrapper: {
        backgroundColor: '#888888',
        flexDirection: 'row',
    },
    chatView: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    end: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end'
    }
});

export default class ChatScreen extends React.Component {
    static navigationOptions = ({navigation, screenProps}) => {
        const params = navigation.state.params || {};
        console.log('CHAT:',params.chat);
        let title = params.chat.type === 'group' ? params.chat.name : params.chat.participants.filter(u => u.id !== screenProps.store.user.id).map(u =>  u.prename + ' ' + u.lastname)[0];
        return {
            headerTitle: title,
            headerLeft: (
                <Button onPress={() => navigation.navigate('Home')} transparent><Icon name="ios-arrow-back-outline"/></Button>
            )
        };
    };

    constructor(props) {
        super(props);
        this.store = this.props.screenProps.store;
        this.state = {
            user: null,
            chat: null,
            text: '',
            ready: false,
            messages: [],
        };
    }

    componentWillMount() {
        if (this.props.navigation.state.hasOwnProperty('params') && this.props.navigation.state.params !== undefined) {
            //Get the given chat
            let chat = this.props.navigation.state.params.chat;
            if (chat !== undefined) {
                //Set chat to the current state
                this.setState({chat: chat});
                // Get the messages to the current Chat
                this.store.getMessagesForChat(chat).then((msgs) => {
                    this.setState({messages: msgs, ready: true});
                });
            } else {
                Alert.alert('Fehler', 'Chat nicht gefunden', [{
                    text: 'Fehler!', onPress: () => {
                        this.props.navigation.navigate('Chats');
                    }, style: 'destroy'
                }]);
            }
        } else {
            Alert.alert('Fehler', 'Es trat ein kritischer, interner Fehler auf! 💥💀💥', [{
                text: 'OhOh!', onPress: () => {
                    this.props.navigation.navigate('Chats');
                }, style: 'destroy'
            }]);
        }
    }

    componentDidMount() {
        // Start listen for created messages
        this.store.app.service('messages').on('created', createdMessage => {
            console.log('NEUE NACHRICHT WTF!', this.store.user.email);
            if (createdMessage.chat_id === this.state.chat.id) {
                //If the message is for this chat add it to the state for msgs
                let msgs = this.state.messages;
                createdMessage = ApiStore.formatMessage(createdMessage);
                this.setState((previousState) => {
                    return {
                        messages: GiftedChat.append(previousState.messages, createdMessage)
                    }
                });
                //msgs.push(createdMessage);
                //this.setState({messages: msgs});
                console.log('Neue Nachricht gepusht!')
            }
        });
    }

    send = (message) => {

        this.store.sendMessage({
            sender_id: this.store.user.id,
            chat_id: this.state.chat.id,
            text: message[0].text
        }).then(()=>{
            console.log('Nachricht wurde gesendet:', message[0].text);
        }).catch((error) => {
            console.error('ChatScreen, error send msg', error);
        })
    };

    /*
    renderChat = (item) => {
        return (
            <ListItem avatar>
                <Left>
                    <Thumbnail source={{uri: 'https://api.adorable.io/avatars/200/' + this.state.user.email + '.png'}}/>
                </Left>
                <Body>
                <Text>#{this.store.user.prename}</Text>
                <Text note>{item.text}</Text>
                </Body>
                <Right>
                    <TimeAgo time={item.send_date}/>
                </Right>
            </ListItem>
        )
    };
    */

    render() {
        if (!this.state.ready)
            return (
                <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                    <Spinner color='red'/>
                </View>
            );
        return (
            <GiftedChat
                messages={this.state.messages}
                onSend={(messages) => this.send(messages)}
                onPressAvatar={(user) => {this.props.navigation.navigate('View', {id: user._id})}}
                user={
                    {
                        _id: this.store.user.id,
                        name: this.store.user.prename + ' ' + this.store.user.lastname,
                        avatar: 'https://api.adorable.io/avatars/200/' + this.store.user.email,
                    }
                }
                locale='de'
            />
        )
    }
}
