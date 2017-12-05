import React from 'react';
import {KeyboardAvoidingView, TextInput, StyleSheet, View, AsyncStorage, Text, Image, Alert} from 'react-native';
import {Body, Button, Container, Icon, Left, List, ListItem, Right, Thumbnail} from 'native-base'

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

        this.props.navigation.setParams({
            user: this.state.user,
        });
    }

    componentDidMount() {
        if (this.props.navigation.state.hasOwnProperty('params') && this.props.navigation.state.params !== undefined) {
            let user = this.props.navigation.state.params.user;
            console.log(this.props.navigation.state);
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

    send = () => {
        this.store.sendMessage({
            sender_id: this.store.user.id,
            chat_id: this.state.chat.id,
            text: this.state.text
        }).then((msg) => {
            let m = this.state.messages;
            m.push(msg);
            this.setState({messages: m});
        }).catch((error) =>{
            console.log('ChatScreen, error send msg',error);
        })
    };


    renderChat = (item) => {
        console.log('message', item);
        let position = (this.state.nickname === item.nickname) ? 'right' : 'left';
        this.id++;
        // <Message pos={position} message={item.message}/>
        return (
            <ListItem avatar>
                <Left>
                    <Thumbnail source={{uri: 'https://api.adorable.io/avatars/200/' + this.state.user.email + '.png'}}/>
                </Left>
                <Body>
                <Text>#heil</Text>
                <Text note>{item.data.text}</Text>
                </Body>
                <Right>
                    <TimeAgo time={item.data.send_date}/>
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
            <Container>
                <KeyboardAvoidingView style={styles.end} behavior='padding'>
                    <List dataArray={this.state.messages} renderRow={this.renderChat}/>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.input}
                            onChangeText={(text) => this.setState({text: text})}
                            value={this.state.text}
                        />
                        <Icon containerStyle={{width: '50%'}} name='send' color='#FF0000' onPress={this.send}/>
                        <Button onPress={this.send}><Text>dsaffsadadsfadfsafds</Text></Button>
                    </View>
                </KeyboardAvoidingView>
            </Container>
        )
    }
}
