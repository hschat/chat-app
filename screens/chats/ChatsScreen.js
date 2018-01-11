import React, {Component} from 'react';
import {Button, Icon, Text, View, List, ListItem, Left, Body, Right, Thumbnail, Content} from "native-base";
import {FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import {Col, Row, Grid} from 'react-native-easy-grid';

import UpdateComponent from '../../components/UpdateComponent';
import TimeAgo from "../../components/TimeAgo";
import {autobind} from "core-decorators";
import {observer} from "mobx-react";
import {observe} from "mobx";

const styles = StyleSheet.create({
    list: {
        borderBottomWidth: 2,
        borderColor: '#333333',
        paddingBottom: 3,
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
        observe(this.store, "chats", this.updateChats, true);
    }

    componentDidMount() {
        let chats = this.state.chats;
        chats.forEach(async (c, i) => {
            // Lode for each chat the last msg send to it
            let msg = await this.store.getLastMessageForChat(c);
            msg = msg === undefined ? "Keine Nachrichten vorhanden" : msg;
            c[i].last_message = msg;
        });
        this.setState({chats: chats});
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

        return (
            <TouchableOpacity onPress={() => {
                this.props.navigation.navigate('Chat', {chat: chat});
            }}>
                <Grid style={styles.list}>
                    <Row>
                        <Col size={1}>
                            <Thumbnail
                                source={{uri: 'https://api.adorable.io/avatars/200/' + chat.type === 'group' ? chat.name : chat.participants.filter(u => u.id !== this.store.user.id)[0].email + '.png'}}/>
                        </Col>
                        <Grid>
                            <Row>
                                <Col size={4}>
                                    <Text>{chat.type === 'group' ? chat.name : chat.participants.filter(u => u.id !== this.store.user.id)[0].prename}</Text>
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
                                        <TimeAgo time={this.state.chats[item.index].last_message.send_date}/>}</Text>
                                </Col>
                            </Row>
                        </Grid>

                    </Row>
                </Grid>
            </TouchableOpacity>
        )
    };

    render() {
        if (this.state.chats.length === 0) {
            return (
                <Text>Keine chats vorhanden</Text>
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
