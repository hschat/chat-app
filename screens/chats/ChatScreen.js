import React from 'react';
import {KeyboardAvoidingView, TextInput, StyleSheet, View, AsyncStorage, Text, Image, Alert} from 'react-native';
import {Body, Button, Container, Icon, Left, List, ListItem, Right, Thumbnail, Spinner} from 'native-base'
import {GiftedChat} from 'react-native-gifted-chat';

import Message from '../../components/message'
import TimeAgo from "../../components/TimeAgo";

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
        return {
            headerTitle: `Chat mit ${params.chat.recievers[0].prename}`,
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

    componentDidMount() {
        if (this.props.navigation.state.hasOwnProperty('params') && this.props.navigation.state.params !== undefined) {
            //Get the given chat
            let chat = this.props.navigation.state.params.chat;
            if (chat !== undefined) {
                //Set user to the current state
                this.setState({chat: chat});
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

    send = (message) => {
        console.log('message', message);
        this.store.sendMessage({
            sender_id: this.store.user.id,
            chat_id: this.state.chat.id,
            text: message[0].text
        }).catch((error) => {
            console.error('ChatScreen, error send msg', error);
        })
    };


    renderChat = (item) => {
        let position = (this.store.user.id === item.sender_id) ? 'right' : 'left';
        // <Message pos={position} message={item.message}/>
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
                user={this.store.user}
                locale='de'
            />
        )
    }
}
