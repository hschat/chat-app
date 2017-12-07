import React, {Component} from 'react';
import {Button, Icon, Text, View, List, ListItem, Left, Body, Right, Thumbnail} from "native-base";
import UpdateComponent from '../../components/UpdateComponent';
import TimeAgo from "../../components/TimeAgo";
import {observable, observe} from "mobx";
import {observer} from "mobx-react";

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
        //setTimeout(this.debugShit, 5000);
    }

    componentWillMount() {
        observe(this.store, "chats", this.updateChats, true);

        this.store.getChats(this.store.user);
    }

    debugShit = () => {
        console.log('Store Update:', this.store.chats);
        setTimeout(this.debugShit, 5000);
    };

    updateChats=()=>{
        //if(this.state.mounted) {
            console.log('CHATS UPDATED CALLED', this.state.chats);
            this.setState({chats: this.store.chats});
            console.log('CHATS UPDATED FINISH' , this.state.chats);
        //}
    };

    renderChats = (item) => {
        console.log('CHATS', item);
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
    };

    render() {
        return (
            <List dataArray={this.state.chats} renderRow={this.renderChats}/>
        );
    }
}
