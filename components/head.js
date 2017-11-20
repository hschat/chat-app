import React from 'react';
import {Text, Header, Left, Right, Icon, Body} from "native-base";
import { Image, StyleSheet, View } from 'react-native';
import { Link } from 'react-router-native';

const styles = StyleSheet.create({

    back:{
        textAlign: 'center',
        fontSize: 21,
    }
});


export default class Head extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    componentWillUnmount() {
    }

    render() {
        let left, body, right;

        if(this.props.back!==undefined){
            left = <Left><Link to={this.props.back}><Text><Icon name='ios-arrow-back'/><Text style={styles.back}> Zurück</Text></Text></Link></Left>
        }else{
            left= <Left/>
        }
        if(this.props.message!==undefined){
            body = <Body><Text>{this.props.message}</Text></Body>
        }else{
            body = <Body><Image source={require('../assets/img/logo-only.png')} style={{height: 40, width: 40}}/></Body>
        }

        return (
            <Header androidStatusBarColor='#FFFFFF' backgroundColor='#FFFFFF'
                    style={{height: 75, paddingTop: 20, backgroundColor:'#FFFFFF'}}>
                {left}
                {body}
                <Right/>
            </Header>
        );
    }
}
