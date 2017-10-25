import React from 'react';
import { View, Text, StyleSheet  } from 'react-native';

const styles = StyleSheet.create({
    message: {
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 10,
        marginRight: 10,
        minHeight: 45,
        paddingLeft: 6,
        paddingRight: 6,
        maxWidth: '70%',
        borderWidth: 6,
        borderColor: '#d80030',
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 0,
    },
    text:{
        fontSize: 18,
    },
    left:{
        alignSelf: 'flex-start'
    },
    right:{
        alignSelf: 'flex-end',
    }
});

export default class Chat extends React.Component {

    constructor(props) {
        super(props);
        this.state = {text: ''};
    }

    render() {
        return (
            <View style={[styles.message, styles.left, {backgroundColor: '#d80030'}]}>
              <Text style={[styles.text, {color: '#FFFFFF'}]}>Message</Text>

            </View>
        )
    }
}
