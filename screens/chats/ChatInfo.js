import React, {Component} from 'react';
import {
    Text,
    View,
    Button,
    Icon,
} from "native-base";

export default class ChatInfo extends React.Component {

    static navigationOptions = ({navigation, screenProps}) => {
        const params = navigation.state.params || {};
        return {
            headerTitle: params.chat.participants.filter(u => u.id !== screenProps.store.user.id).map(u => u.prename + ' ' + u.lastname)[0],
            headerLeft: (
                <Button onPress={() => navigation.navigate('Chat')} transparent><Icon
                    name="ios-arrow-back-outline"/></Button>
            )
        }
    };

    constructor(props) {
        super(props);
        this.store = this.props.screenProps.store;
    }

    render() {

        return (
            <View>
                <Text>Hier kommen die Einstellungen für den Userchat!</Text>
            </View>
        );
    }
}