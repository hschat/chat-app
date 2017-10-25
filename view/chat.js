import React from 'react';
import { KeyboardAvoidingView, TextInput, StyleSheet, Text, View, StatusBar, Platform } from 'react-native';
import { Icon } from 'react-native-elements'
import { Link } from 'react-router-native';

import Message from '../components/message'


const styles = StyleSheet.create({
    input: {
        height: 35,
        borderColor: 'gray',
        borderWidth: 1,
        marginLeft: 6,
        marginRight: 6,
        marginTop: 2,
        marginBottom:2,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
     },
    navBar:{
        paddingTop: (Platform.OS === 'ios') ? 20 : 0,
        height:40,
        backgroundColor: '#d80030'
    },
    inputWraper:{
        backgroundColor: '#888888',
    },
    end:{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end'
    }
});

export default class Chat extends React.Component {

    constructor(props) {
        super(props);
        this.state = { text: '', messages: [] };
        //this.setState({messages: {[user: 'timo', msg: 'asdf'], user:'david',}})
    }
    render() {
        return (
            <View style={{flex: 1}}>
                <StatusBar barStyle='default' backgroundColor='#d80030' />
                <View style={styles.navBar}>
                    <Link to='/'>
                        <View>
                        <Icon name='chevron-left' color='#FFFFFF'/>
                        </View>
                    </Link>
                </View>
                <KeyboardAvoidingView style={styles.end} behavior='padding'>

                    <Message />

                    <View style={styles.inputWraper}>
                        <TextInput
                            style={styles.input}
                            onChangeText={(text) => this.setState({text})}
                            value={this.state.text}
                        />
                    </View>
                </KeyboardAvoidingView>
            </View>
        )
    }
}
