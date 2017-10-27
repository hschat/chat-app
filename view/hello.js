import React from 'react';
import {View, StyleSheet, Image, AsyncStorage} from 'react-native';
import {Redirect} from 'react-router-native';
import {
  FormInput, Button, Header, Spinner, Container, Title, Icon, Left, Body, Right, Input, Form,
  Text, Item, Label
} from 'native-base'

import {Chat} from './chat'
import LoadingIcon from "../components/loadingIcon";
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
  }
});

export default class Hello extends React.Component {

  constructor(props) {
    super(props);
    this.api = new ChatAPI();
    this.state = {
      name: '',
      loaded: false,
      joined: false
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

  send = () => {
    let data = {
      type: 'join',
      nickname: this.state.name,
      sent: Date.now()
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
          <Header backgroundColor='d80030' style={{height: 75, paddingTop: 20}}>
            <Left/>
            <Body>
              <Image source={require('../assets/img/logo-only.png')} style={{height: 45, width: 45}}/>
              <Text>HS Chat</Text>
            </Body>
            <Right/>
          </Header>
          <Image source={require('../assets/img/bg.png')} style={styles.backgroundImage}>
            <Form style={styles.middle}>
              <Item floatingLabel last style={{backgroundColor: 'rgb(255,255,255)'}}>
                <Label>#nickname</Label>
                <Input onChangeText={this.setName}
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
            </Form>
          </Image>
        </Container>
      )
    )
  }
}
