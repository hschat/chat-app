import React, {Component} from 'react';
import {Button, Icon, Text, View, List, ListItem, Left, Body, Right, Thumbnail, Content} from "native-base";
import {FlatList, TouchableOpacity, StyleSheet, Image} from 'react-native';
import {Col, Row, Grid} from 'react-native-easy-grid';
import BaseStyles from '../../baseStyles';
import UpdateComponent from '../../components/UpdateComponent';
import TimeAgo from "../../components/TimeAgo";
import {autobind} from "core-decorators";
import {observer} from "mobx-react";
import {observe} from "mobx";

const styles = StyleSheet.create({
    list: {
        borderBottomWidth: 2,
        borderColor: '#333333',
        paddingBottom: 5,
        paddingTop: 5,
    }
});

@autobind @observer
export default class ChatsScreen extends Component {
    static navigationOptions = ({navigation}) => ({
        title: 'Chats',
        headerRight: (
            <Button onPress={() => {
                navigation.navigate('CreateGroup')
            }} transparent><Icon name="md-person-add"/></Button>
        ),
        headerLeft: (
            <Text></Text>
        )
    });

    constructor(props) {
        super(props);
        this.store = this.props.screenProps.store;
        this.state = {
            chats: [],
        };
    }

    componentWillMount() {
        //Load all chats from the server
        this.store.getChats(this.store.user).then((chats) => {
            console.log('LADEN DER ALTEN CHATS')
            this.setState({chats: chats});
        });
    }

    componentDidMount() {

        this.store.app.service('chats').on('created', createdChat => {
            console.log('NEUER CHAT');
            let chats = this.state.chats;
            chats.push(createdChat);
            this.setState({chats: chats});
        });
        this.store.app.service('chats').on('update', updatedChat => {
            console.log('UPDATE ALTE CHATS');
            let chats = this.state.chats;
            chats.forEach((chat, index) => {
                if (chat.id === updatedChat.id) {
                    chats[index] = updatedChat;
                    this.setState({chats: chats});
                }
            });
        });
    }

    /**
     * called if there is a new chat in the store
     * also this function loads all chats from the store in this state
     */
    updateChats = () => {
        console.log('CHATS UPDATED CALLED', this.state.chats);
        this.setState({chats: this.store.chats});
        console.log('CHATS UPDATED FINISH', this.state.chats);
    };

    /*
    shouldComponentUpdate(nextProps, nextState) {
        //console.log('nextState',nextState);
        return true;
    }
    */

    _keyExtractor = (item, index) => index;
    renderChats = (item) => {
        //Load the last msg send to this chat
        let chat = item.item;
        let title = chat.type === 'group' ? chat.name : chat.participants.filter(u => u.id !== this.store.user.id).map(u =>  u.prename + ' ' + u.lastname)[0];

        return (
            <TouchableOpacity onPress={() => {
                this.props.navigation.navigate('Chat', {chat: chat});
            }}>
                <Grid style={styles.list}>
                    <Col>
                        <Row>
                            <Col size={1}>
                                <Thumbnail
                                    source={{uri: `https://api.adorable.io/avatars/200/${chat.type === 'group' ? chat.name : chat.participants.filter(u => u.id !== this.store.user.id)[0].email}.png`}}/>
                            </Col>
                            <Col size={4}>
                                <Row>
                                    <Col size={4}>
                                        <Text>{title}</Text>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Text>{chat.last_message === undefined ? 'Loading...' : this.state.chats[item.index].last_message.text}</Text>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Text>{this.state.chats[item.index].last_message === undefined ? 'Loading...' :
                                            <TimeAgo
                                                time={this.state.chats[item.index].last_message.send_date}/>}</Text>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Col>
                </Grid>
            </TouchableOpacity>
        )
    };

    render() {
        if (this.state.chats.length === 0) {
            return (
                <View>
                    <Text>Keine chats vorhanden</Text>
                </View>
            )
        }
        return (
            <Content>
                <FlatList data={this.state.chats} renderItem={this.renderChats} keyExtractor={this._keyExtractor}/>
            </Content>
        );
    }
}


/*
<List dataArray={this.state.chats} renderRow={this.renderChats}/>
*/
