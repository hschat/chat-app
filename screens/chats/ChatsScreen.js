import React, {Component} from 'react';
import {Button, Icon, Text, View, List, ListItem, Left, Body, Right, Thumbnail, Content} from "native-base";
import {FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import {Col, Row, Grid} from 'react-native-easy-grid';

import UpdateComponent from '../../components/UpdateComponent';
import TimeAgo from "../../components/TimeAgo";
import {observable, observe} from "mobx";
import {observer} from "mobx-react";

const styles = StyleSheet.create({
    list: {
        borderBottomWidth: 2,
        borderColor: '#333333',
        paddingBottom: 3,
    }
});

@observer
export default class ChatsScreen extends Component {
    static navigationOptions = ({navigation}) => ({
        title: 'Settings'
    });

    @observable store;

    constructor(props) {
        super(props);
        this.store = this.props.screenProps.store;
        this.state = {
            chats: [],
            mounted: false
        };

    }

    componentWillMount() {
        observe(this.store, "chats", this.updateChats, true);
    }

    debugShit = () => {
        console.log('Store Update:', this.store.chats);
        setTimeout(this.debugShit, 5000);
    };

    updateChats = () => {
        console.log('CHATS UPDATED CALLED', this.state.chats);
        this.setState({chats: this.store.chats});
        this.forceUpdate();
        //console.log('CHAT STORE', this.store.chats);
        console.log('CHATS UPDATED FINISH', this.state.chats);

    };

    shouldComponentUpdate(nextProps, nextState) {
        //console.log('nextState',nextState);
        return true;
    }

    _keyExtractor = (item, index) => index;
    renderChats = (item) => {
        //Load the last msg send to this chat
        let msg = this.store.getLastMessagesForChat(item.item);
        return (
            <TouchableOpacity onPress={() => {
                this.props.navigation.navigate('Chat', {chat: item.item});}} >
            <Grid style={styles.list}>
                <Row>
                    <Col size={1}>
                        <Thumbnail source={{uri: 'https://api.adorable.io/avatars/200/' + item.item.type === 'group' ? item.item.avatar : item.item.participants.filter(u => u.id !== this.store.user.id)[0].email + '.png'}}/>
                    </Col>
                    <Grid>
                        <Row>
                            <Col size={4}>
                                <Text>{item.item.type === 'group' ? item.item.name : item.item.participants.filter(u => u.id !== this.store.user.id)[0].prename}</Text>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Text>{msg[0]}</Text>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                              <Text>Vor <TimeAgo time={msg.send_date} hideAgo={true}/></Text>
                            </Col>
                        </Row>
                    </Grid>

                </Row>
            </Grid>
            </TouchableOpacity>
        )
    };

    render() {
        if(this.state.chats.length===0){
          return(
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
