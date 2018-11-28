import React from 'react';
import {KeyboardAvoidingView, TextInput, StyleSheet, View, AsyncStorage, Text, Image, Alert} from 'react-native';
import {Body, Button, Container, Icon, Left, List, ListItem, Right, Thumbnail, Spinner} from 'native-base'
import {GiftedChat} from 'react-native-gifted-chat';
import {NavigationActions, SafeAreaView} from 'react-navigation';

import Message from '../../components/message'
import TimeAgo from "../../components/TimeAgo";
import ApiStore from '../../ApiStore';
import i18n from '../../translation/i18n'


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
        let title = params.chat.type === 'group' ? params.chat.name : params.chat.participants.filter(u => u.id !== screenProps.store.user.id).map(u => u.prename + ' ' + u.lastname)[0];
        if (params.chat.type === 'group') {
            return {
                headerTitle: (
                    <Button onPress={() => navigation.navigate('InfoGroup', {chat: params.chat})} transparent>
                        <Text style={{fontWeight: '600', fontSize: 17, lineHeight: 19}}>{params.chat.name}</Text>
                    </Button>
                ),
                headerLeft: (
                    <Button onPress={() => navigation.navigate('Home')} transparent>
                        <Icon name="ios-arrow-back-outline"/>
                    </Button>
                )
            };
        } else {
            return {
                headerTitle: (
                    <Button onPress={() => navigation.navigate('Info', {chat: params.chat})} transparent>
                        <Text style={{fontWeight: '600', fontSize: 17, lineHeight: 19}}>{params.chat.participants.filter(u => u.id !== screenProps.store.user.id).map(u => u.prename + ' ' + u.lastname)[0]}</Text>
                    </Button>
                ),
                headerLeft: (
                    <Button onPress={() => navigation.navigate('Home')} transparent>
                        <Icon name="ios-arrow-back-outline"/>
                    </Button>
                )
            };
        }
    };

    constructor(props) {
        super(props);
        this.store = this.props.screenProps.store;
        this.state = {
            user: null,
            chat: null,
            participants: null,
            text: '',
            ready: false,
            messages: [],
            isTyping: false,
            typingUser: undefined,
        };
        this.typingTimer = null;
    }

    getState() {
        return this.state;
    } 

    updateParticipants(chat){
        if(! chat ) return;

        this.store.getUsersForChat(chat).then((users) => {
            this.setState({participants: users[0].participants});
        });
    } 

    componentWillMount() {
        if (this.props.navigation.state.hasOwnProperty('params') && this.props.navigation.state.params !== undefined) {
            //Get the given chat
            let chat = this.props.navigation.state.params.chat;
            if (chat !== undefined) {
                //Set chat to the current state
                this.setState({chat: chat});
                // Get the messages to the current Chat
                //console.log('ChatScreen/WillMount', chat);
                this.store.getMessagesForChat(chat).then((msgs) => {
                    this.setState({messages: msgs, ready: true});
                });

                // get all participants for this chat
                this.updateParticipants(chat);

                // update online / last online every 5 seconds
                setInterval(() => {
                    this.updateParticipants(chat);
                }, 5000);

            } else {
                Alert.alert(i18n.t('ChatScreen-Error'), i18n.t('ChatScreen-ChatNotFound'), [{
                    text: i18n.t('ChatScreen-Error'), onPress: () => {
                        this.props.navigation.navigate('Chats');
                    }, style: 'destroy'
                }]);
            }
        } else {
            Alert.alert(i18n.t('ChatScreen-Error'), i18n.t('ChatScreen-FatalError'), [{
                text: i18n.t('ChatScreen-OHOH'), onPress: () => {
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
                console.log('Wat you gona dooo with this he?', createdMessage);
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

        // Start listening for recieving typing events
        this.store.app.service('typing').on('created', typingEvent => {
            console.log('typing event recieved', typingEvent);
            if(typingEvent.chat_id === this.state.chat.id){
                if(typingEvent.sender_id !== this.store.user.id) {
                    this.setState({isTyping: true, typingUser: typingEvent});
                    this.handleNewTyping();
                } else { // I am typing
                    // For testing: REMOVE LATER $FIXME$
                    //this.setState({isTyping: true, typingUser: typingEvent});
                    //this.handleNewTyping();
                }
            } //else ignore typing message in this chat
            
        });
    }

    handleNewTyping() {
        if(this.typingTimer) {
            clearTimeout(this.typingTimer);
        } 
        this.typingTimer = setTimeout(() => this.setState({isTyping: false, typingUser: null}), 5000);
    } 

    sendTyping = (text) => {
        if(text && text !== ''){
            //if at least one key was typed
            let data = {
                sender_id: this.store.user.id,
                chat_id: this.state.chat.id,
            };
            this.store.sendTyping(data)
            .then(() => {
                console.log('Typing wurde gesendet:', data);
            }).catch((error) => {
                console.error('ChatScreen, error send msg', error);
            })
        }
    };

    send = (message) => {

        this.store.sendMessage({
            sender_id: this.store.user.id,
            chat_id: this.state.chat.id,
            text: message[0].text
        }).then(() => {
            console.log('Nachricht wurde gesendet:', message[0].text);
        }).catch((error) => {
            console.error('ChatScreen, error send msg', error);
        })
    };

    // either returns "Schreibt..." or "PrenameXY schreibt..." or "Zuletzt online: Date" or "Online" or nothing
    evaluateChatInformation(props){
        if(this.state === undefined || ! this.state.participants) return null;

        if(this.state.participants.length > 2){
            // Group chat
            if(this.state.isTyping){
                var user = this.state.participants.filter( (user) => user.id === this.state.typingUser.sender_id)[0];
                return (<Text style={{color: '#E00034'}}>{user.prename} {i18n.t('ChatScreen-SmallTyping')}</Text>);
            } 
        } else {
            // 2 people chat
            if(this.state.isTyping){
                return (<Text style={{color: '#E00034'}}>{i18n.t('ChatScreen-BigTyping')}</Text>);
            } else {
                var user = this.state.participants.filter( (user) => user.id !== this.store.user.id)[0];
                if(user.isOnline){
                    return (<Text>{i18n.t('ChatScreen-Online')}</Text>);
                } else if(user.last_time_online){
                    return (<Text>{i18n.t('ChatScreen-LastOnline')}<TimeAgo time={user.last_time_online} name={'last_online'}/></Text>);
                } else return null; // not online
            } 
        } 
    } 

    render() {
        if (!this.state.ready)
            return (
                <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                    <Spinner color='red'/>
                </View>
            );
        return (
            <SafeAreaView style={{flex: 1}}>
                <GiftedChat
                    state={this.state} 
                    store={this.store} 
                    messages={this.state.messages}
                    onSend={(messages) => this.send(messages)}
                    onInputTextChanged={text => this.sendTyping(text)}
                    renderAvatar={this.state.chat.type === 'group' ? '':null}
                    renderFooter={this.evaluateChatInformation}
                    onPressAvatar={(user) => {
                        this.props.navigation.navigate('View', {id: user._id})
                    }}
                    user={
                        {
                            _id: this.store.user.id,
                            name: this.store.user.prename + ' ' + this.store.user.lastname,
                            avatar: 'https://api.adorable.io/avatars/200/' + this.store.user.email,
                        }
                    }
                    locale='de'
                />
            </SafeAreaView>
        )
    }
}
