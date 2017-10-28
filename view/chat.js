import React from 'react';
import {KeyboardAvoidingView, TextInput, StyleSheet, View, AsyncStorage, FlatList, Text, Image} from 'react-native';
import {Link, Redirect} from 'react-router-native';
import {Body, Button, Container, Header, Icon, Left, List, ListItem, Right, Thumbnail} from 'native-base'

import Message from '../components/message'
import ChatAPI from "../ChatAPI";


const styles = StyleSheet.create({
  input: {
    height: 35,
    borderColor: 'gray',
    borderWidth: 1,
    marginLeft: 6,
    marginRight: 6,
    marginTop: 2,
    marginBottom: 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    width: '90%',
    flex: 1
  },
  navBar: {
    paddingTop: 20,
    height: 40,
    backgroundColor: '#d80030'
  },
  inputWrapper: {
    backgroundColor: '#888888',
    flexDirection: 'row',
  },
  chatView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  end: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end'
  }
});

export default class Chat extends React.Component {

  constructor(props) {
    super(props);
    this.api = new ChatAPI();
    this.state = {
      nickname: '',
      text: '',
      redirectHome: false,
      messages: [],
    };
  }

  async componentWillMount() {
    try {
      const nickname = await AsyncStorage.getItem('@ChatStore:nickname');
      if (nickname !== null) {
        this.setState({nickname: nickname});
      }
    } catch (error) {
      // ToDo
    }

    this.api.on('message', (data) => {
      console.log('chat-recieved: ', data);
      let msgs = this.state.messages;
      msgs.push(data);
      this.setState({messages: msgs});
    }, {
      duration: 'infinite'
    });
  }

  send = () => {
    if (this.state.text.trim() === '') return;
    this.api.sendMessage({
      type: 'message',
      text: this.state.text,
      nickname: this.state.nickname,
      sent: Date.now()
    });
    this.setState({text: ''});
  };

  renderBack = () => {
    this.setState({redirectHome: true});
  };

  renderChat = (item) => {
    console.log('message', item);
    let position = (this.state.nickname === item.nickname) ? 'right' : 'left';
    this.id++;
    // <Message pos={position} message={item.message}/>
    return (
      <ListItem avatar>
        <Left>
          <Thumbnail source={require('../assets/img/user.png')} />
        </Left>
        <Body>
          <Text>#{item.nickname}</Text>
          <Text note>{item.message}</Text>
        </Body>
        <Right>
          <Text note>{item.sent}</Text>
        </Right>
      </ListItem>
    )
  };

  render() {
    if (this.state.redirectHome) return <Redirect push to="/"/>;
    return (
      <Container>
        <Header backgroundColor='#d80030' style={{height: 75, paddingTop: 20}}>
          <Left>
            <Button transparent onPress={this.renderBack}>
              <Icon ios='ios-arrow-back-outline' android='md-arrow-back'/>
            </Button>
          </Left>
          <Body>
            <Image source={require('../assets/img/logo-only.png')} style={{height: 45, width: 45}}/>
            <Text>HS Chat</Text>
          </Body>
          <Right/>
        </Header>
        <KeyboardAvoidingView style={styles.end} behavior='padding'>
          <List dataArray={this.state.messages} renderRow={this.renderChat}/>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              onChangeText={(text) => this.setState({text})}
              value={this.state.text}
            />
            <Icon containerStyle={{width: '10%'}} name='send' color='#FF0000' onPress={this.send}/>

          </View>
        </KeyboardAvoidingView>
      </Container>
    )
  }
}
