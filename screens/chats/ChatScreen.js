import React from 'react';
import {KeyboardAvoidingView, TextInput, StyleSheet, View, AsyncStorage, Text, Image, Alert} from 'react-native';
import {Body, Button, Container, Icon, Left, List, ListItem, Right, Thumbnail} from 'native-base'
import { GiftedChat } from 'react-native-gifted-chat';

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
            headerTitle: `Chat mit ${params.user.prename}`,
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
            let user = this.props.navigation.state.params.user;
            if (user !== undefined) {
                this.setState({user: user});
                this.store.createChat({
                    owner: this.store.user.id,
                    recievers: [user.id]
                }).then((chat) => {
                    this.setState({chat: chat, ready: true});
                }).catch((error) => {
                    Alert.alert('Fehler', 'Chat nicht gefunden', [{
                        text: 'Oh fuck!', onPress: () => {
                            this.props.navigation.navigate('Chats');
                        }, style: 'destroy'
                    }]);
                })
            } else {
                Alert.alert('Fehler', 'Benutzer nicht gefunden', [{
                    text: 'Oh fuck!', onPress: () => {
                        this.props.navigation.navigate('Chats');
                    }, style: 'destroy'
                }]);
            }
        } else {
            Alert.alert('Fehler', 'Es trat ein kritischer, interner Fehler auf! 💥💀💥', [{
                text: 'Oh fuck!', onPress: () => {
                    this.props.navigation.navigate('Chats');
                }, style: 'destroy'
            }]);
        }

    }

    send = (message) => {
        console.log('message',message);
        this.store.sendMessage({
            sender_id: this.store.user.id,
            chat_id: this.state.chat[0].id,
            text: message[0].text
        }).catch((error) =>{
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
                <Text>WARTEN</Text>
            );
        return (
            <GiftedChat
                messages={this.store.messages}
                onSend={(messages) => this.send(messages)}
                user={this.store.user}
                locale='de'
            />
        )
    }
}
