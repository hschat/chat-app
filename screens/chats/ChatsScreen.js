import React, {Component} from 'react';
import {Button, Icon, Text, View, List, ListItem, Left, Body, Right, Thumbnail} from "native-base";
import UpdateComponent from '../../components/UpdateComponent';
import TimeAgo from "../../components/TimeAgo";

export default class ChatsScreen extends Component {
    static navigationOptions = ({navigation}) => ({
        title: 'Settings'
    });

    constructor(props) {
        super(props);
        this.store = this.props.screenProps.store;
        this.state = {
            chats: {},
        }
    }

    componentWillMount() {
        this.store.getChats(this.store.user).then((chats) => {
            this.setState({chats: chats});
            console.info('Screen chats success:', chats);
        }).catch((error) => {
            console.error('Screen chats error:', error);
        });
    }

    renderChats = (item) => {
        return (
            <ListItem avatar style={{backgroundColor: 'transparent'}} button={true} onPress={() => {
                this.props.navigation.navigate('Chat', {user: item.recievers[0]});
            }}>
                <Left>
                    <Thumbnail source={{uri: 'https://api.adorable.io/avatars/200/' + item.recievers[0].email + '.png'}}/>
                </Left>
                <Body>
                <Text>#{item.recievers[0].prename} {item.recievers[0].lastname}</Text>
                </Body>
            </ListItem>
        )
    }

    render() {
        return (
            <List dataArray={this.state.chats} renderRow={this.renderChats}/>
        );
    }
}
