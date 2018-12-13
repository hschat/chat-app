import React, {Component} from 'react';
import {Button, Icon, Text, View, List, ListItem, Left, Body, Right, Thumbnail, Content} from "native-base";
import {FlatList, TouchableOpacity, StyleSheet, Image} from 'react-native';
import {Col, Row, Grid} from 'react-native-easy-grid';
import BaseStyles from '../../baseStyles';
import UpdateComponent from '../../components/UpdateComponent';
import LastChatMessage from '../../components/LastChatMessage'
import ChatUpdateTime from '../../components/ChatUpdateTime'
import TimeAgo from "../../components/TimeAgo";
import {autobind} from "core-decorators";
import {observer} from "mobx-react";
import {observe} from "mobx";
import i18n from '../../translation/i18n';

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
            chats.sort(this.compare);
            this.setState({chats: chats});
        });

        this.store.app.service('chats').on('created', createdChat => {
            let chats = this.state.chats;
            chats.push(createdChat);
            this.setState({chats: chats});
        });

        this.store.app.service('chats').on('patched', updatedChat => {
            let xchats = this.state.chats;
            // Check if User is part of every updatedChat
            let groupToDeleteId = -1;

            let contained = false;
            if(updatedChat.participants.length === 0) {
                return;
            }
            for(let x = 0; x < updatedChat.participants.length; x++) {
                if(updatedChat.participants[x].id === this.store.user.id) {
                    contained = true;
                    break;
                }
            }

            const userIndex = updatedChat.participants.indexOf(this.store.user.id);
            if(!contained && userIndex === -1) {
                groupToDeleteId = updatedChat.id;
            }
                
            // Remove the Chat if the User is no longer part of it
            if(groupToDeleteId !== -1) {
                for(let i = 0; i < xchats.length; i++) {
                    if(xchats[i].id === groupToDeleteId) {
                        xchats.splice(i, 1);
                        break;
                    }
                }
            }
            this.setState({chats: xchats});

            this.store.completeParticipantUserInfo(updatedChat).then((chatWithParticipants) => {
                let chats = this.state.chats;
                chats.forEach((chat, index) => {
                    if (chat.id === chatWithParticipants.id) {
                        chats[index] = chatWithParticipants;
                    }
                });
                chats.sort(this.compare);
                this.setState({chats: chats});
            });
        });
    }

    componentDidMount() {

        
    }


    compare = (a, b) => {
        if (a.updated_at < b.updated_at)
            return 1;
        if (a.updated_at > b.updated_at)
            return -1;
        return 0;
    };

    _keyExtractor = (item, index) => index;
    renderChats = (item) => {
        //Load the last msg send to this chat
        let chat = item.item;
        let title = chat.type === 'group' ? chat.name : chat.participants.filter(u => u.id !== this.store.user.id).map(u => u.prename + ' ' + u.lastname)[0];

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
                                        <LastChatMessage chat={chat} store={this.store}/>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <ChatUpdateTime chat={chat} store={this.store}/>
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
                    <Text>{i18n.t('ChatsScreen-NoChats')}</Text>
                </View>
            )
        }
        return (
            <Content>
                <FlatList data={this.state.chats} extraData={this.state} renderItem={this.renderChats} keyExtractor={this._keyExtractor}/>
            </Content>
        );
    }
}


/*
<List dataArray={this.state.chats} renderRow={this.renderChats}/>
*/
