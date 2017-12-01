import React, {Component} from 'react';
import {Button, Icon, Text, View} from "native-base";
import UpdateComponent from '../../components/UpdateComponent';

export default class ChatsScreen extends Component {
    static navigationOptions = ({navigation}) => ({
        title: 'Settings'
    });

    constructor(props) {
        super(props);
        this.store = this.props.screenProps.store;
        this.state = {
            showToast: false,
        }
    }

    componentWillMount() {
        this.store.getChats(this.store.user).then((chats) => {
            console.log('Screen chats success:', chats);
        }).catch((error) => {
            console.log('Screen chats error:', error);
        });
    }


    render() {
        return (
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <Text>ChatsScreen</Text>
            </View>
        );
    }
}
