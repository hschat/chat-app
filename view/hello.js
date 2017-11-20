import React from 'react';
import {View, StyleSheet, Image, AsyncStorage} from 'react-native';
import {Redirect, Link} from 'react-router-native';
import {
    FormInput, Button, Spinner, Container, Title, Icon, Input, Form,
    Text, Item, Label, Toast
} from 'native-base'


import {Chat} from './chat'
import LoadingIcon from "../components/loadingIcon";
import Header from '../components/head'
import ChatAPI from "../ChatAPI";

const styles = StyleSheet.create({
    middle: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 20
    },
    backgroundImage: {
        flex: 1,
        width: null,
        height: null,
        resizeMode: 'cover'
    },
    link: {
        fontSize: 15,
        color: '#00335C',
    },
    right:{
        marginTop: 15,
        alignSelf: 'flex-end',
    }
});

export default class Hello extends React.Component {

    constructor(props) {
        super(props);
        this.api = new ChatAPI();
        this.state = {
            name: '',
            password: '',
            loaded: false,
            joined: false,
            showToast: false,
        };
    }

    componentWillMount() {
        if (!this.api.state.connected) {
            this.api.on('connect', (state) => {
                this.setState({loaded: true});
            });
        } else {
            this.setState({loaded: true});
        }
    }

    setName = (n) => {
        this.setState({name: n})
    };
    setPassword = (n) => {
        this.setState({password: n});
    };

    send = () => {
        let data = {
            type: 'join',
            nickname: this.state.name,
            sent: new Date().toISOString()
        };

        this.api.sendMessage(data, (data) => {
            console.log(data);

            if (data.type === 'join' && data.success) {
                AsyncStorage.setItem('@ChatStore:nickname', this.state.name);
                this.setState({joined: data.success})
            }

        });
    };


    render() {
        return this.state.joined ? (
            <Redirect to="/chat"/>
        ) : (
            !this.state.loaded ? (
                <Container>
                    <LoadingIcon/>
                </Container>
            ) : (
                <Container>
                    <Header/>
                    <Image source={require('../assets/img/bg.png')} style={styles.backgroundImage}>
                        <Form style={styles.middle}>
                            <Item floatingLabel last style={{backgroundColor: 'rgb(255,255,255)'}}>
                                <Label>E-mail</Label>
                                <Input onChangeText={this.setName}
                                       ref={ref => this.formInput = ref}
                                       bordered
                                />
                            </Item>
                            <Item floatingLabel last style={{backgroundColor: 'rgb(255,255,255)'}}>
                                <Label>Passwort</Label>
                                <Input onChangeText={this.setPassword}
                                       ref={ref => this.formInput = ref}
                                       bordered
                                />
                            </Item>
                            <Button onPress={this.send}
                                    style={{backgroundColor: '#d80030', marginTop: 10}}
                                    underlayColor='#B71234'
                                    iconRight
                                    full>
                                <Text>Beitreten</Text>
                                <Icon ios='ios-log-in' android='md-log-in' size={20}/>
                            </Button>
                            <Link to='auth/signup'  style={styles.right}>
                                <Text>Account erstellen</Text>
                            </Link>
                        </Form>
                    </Image>
                </Container>
            )
        )
    }
}
