import React from 'react';
import {View, StyleSheet, Image, AsyncStorage} from 'react-native';
import {Redirect, Link} from 'react-router-native';
import {
    FormInput, Button, Spinner, Container, Title, Icon, Input, Form,
    Text, Item, Label, Toast, Content, Header, Left, Body, Right
} from 'native-base'

import ChatAPI from '../../ChatAPI';

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        width: null,
        height: null,
        resizeMode: 'cover'
    },
    form:{
        marginTop: 50,
    }
});

export default class signup extends React.Component {

    constructor(props) {
        super(props);
        this.api = new ChatAPI();
        this.state = {
            test:''
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
            <Container>
                <Header androidStatusBarColor='#FFFFFF' backgroundColor='#FFFFFF'
                        style={{height: 75, paddingTop: 20, backgroundColor:'#FFFFFF'}}>
                    <Left>
                        <Link to='/' style={styles.right}>
                            <Icon name='ios-arrow-back' />
                        </Link>
                    </Left>
                    <Body>
                    <Image source={require('../../assets/img/logo-only.png')} style={{height: 40, width: 40}}/>
                    </Body>
                    <Right/>
                </Header>
                <Content>
                    <Form style={styles.form}>
                        <Item stackedLabel>
                            <Label>Vorname</Label>
                            <Input />
                        </Item>
                        <Item stackedLabel>
                            <Label>Nachname</Label>
                            <Input />
                        </Item>
                        <Item stackedLabel last>
                            <Label>Kennung</Label>
                            <Input />
                        </Item>
                        <Item stackedLabel last>
                            <Label>Kennung</Label>
                            <Input />
                        </Item>
                        <Item stackedLabel last>
                            <Label>Passwort</Label>
                            <Input />
                        </Item>
                        <Item stackedLabel last>
                            <Label>Passwort wiederholen</Label>
                            <Input />
                        </Item>
                        <Button onPress={this.send}
                                style={{backgroundColor: '#d80030', marginTop: 10}}
                                underlayColor='#B71234'
                                iconLeft
                                full>
                            <Icon ios='md-person-add' android='md-person-add' size={20}/>
                            <Text>Account erstellen</Text>
                        </Button>
                    </Form>
                </Content>
            </Container>
        )
    }
}
