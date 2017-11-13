import React from 'react';
import {View, StyleSheet, Image, AsyncStorage} from 'react-native';
import {Redirect, Link} from 'react-router-native';
import {
    FormInput, Button, Header, Spinner, Container, Title, Icon, Left, Body, Right, Input, Form,
    Text, Item, Label, Toast
} from 'native-base'



const styles = StyleSheet.create({

});

export default class signup extends React.Component {

    constructor(props) {
        super(props);
        this.api = new ChatAPI();
        this.state = {

        };
    }

    componentWillMount() {

    }

    setName = (n) => {
        this.setState({name: n})
    };
    setPassword = (n) => {
        this.setState({password: n});
    };

    send = () => {

    };


    render() {
        return(
            <Text>Signup</Text>
        )
    }
}
