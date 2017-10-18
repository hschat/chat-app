import React from 'react';
import { KeyboardAvoidingView, TextInput, StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
    input: {
        bottom: 0,
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        padding: 10
    },
});

export default class Chat extends React.Component {

    constructor(props) {
        super(props);
        this.state = { text: '' };
    }
    render() {
        return (
            <View style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'center',
            }}>
                <View style={{width: 50, height: 50, backgroundColor: 'powderblue'}} />
                <View style={{width: 50, height: 50, backgroundColor: 'skyblue'}} />
                <View style={{width: 50, height: 50, backgroundColor: 'steelblue'}} />
            </View>
        )
    }
}



