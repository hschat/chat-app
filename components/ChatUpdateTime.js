import React, {Component} from 'react';
import {StyleSheet, Image, Alert, Dimensions, TouchableOpacity, Text} from 'react-native';
import TimeAgo from "./TimeAgo";

const styles = StyleSheet.create({});


export default class ChatUpdateTime extends Component {

    constructor(props) {
        super(props);
        this.store = this.props.store;
        this.state = {
            time: undefined
        };
    }

    componentWillMount() {
        //Get the last time
        this.setState({time: this.props.chat.updated_at});
        //Set a listener for changes
        this.store.app.service('chats').on('patched', (chat) => {
            this.setState({time: chat.updated_at});
        });
    }

    render() {
        if(!this.state.time)
            return (<Text>Loading…</Text>)
        return (
            <TimeAgo time={this.state.time}/>
        )
    }

}
