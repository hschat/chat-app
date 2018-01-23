import React, {Component} from 'react';
import {StyleSheet, Image, Alert, Dimensions, TouchableOpacity} from 'react-native';
import {Text} from "native-base";

const styles = StyleSheet.create({});

MAX_CHARS = 50;

export default class LastChatMessage extends Component {

    constructor(props) {
        super(props);
        this.store = this.props.store;
        this.state = {
            text: 'Lädt…'
        };
    }

    componentWillMount() {
        //Load the last msg
        this.store.getLastMessageForChat(this.props.chat).then(msg => {
            if (msg !== undefined && !msg.system)
                this.setState({text: msg.text});
            else
                this.setState({text: 'Noch keine Nachrichten'})
        });
        //Set a listener for changes
        this.store.app.service('chats').on('patched', () => {
            this.store.getLastMessageForChat(this.props.chat).then(msg => {
                this.setState({text: msg.text});
            });
        });
    }

    render() {
        let text = this.state.text;

        if (text.length > MAX_CHARS)
            text = text.substring(0, MAX_CHARS) + '...';
        return (
            <Text note>{text}</Text>
        )
    }

}
