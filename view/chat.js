import React from 'react';
import {KeyboardAvoidingView, TextInput, StyleSheet, View, AsyncStorage, FlatList, Text, Image} from 'react-native';
import {Link} from 'react-router-native';
import {Body, Button, Container, Header, Icon, Left, Right} from 'native-base'

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
    flex:1
  },
  navBar: {
    paddingTop: 20,
    height: 40,
    backgroundColor: '#d80030'
  },
  inputWrapper: {
    backgroundColor: '#888888',
    flexDirection:'row',
  },
  chatView:{
    flex:1,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  end: {
    flex: 0,
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
      if (nickname !== null){
        this.setState({nickname: nickname});
      }
    } catch (error) {
      // ToDo
    }

    this.api.on('message', (data) => {
      let msgs = this.state.messages;
      msgs.push(data);
      this.setState({messags: msgs});
    }, {duration: 'infinite'});
  }

  send = () => {
    if(this.state.text.trim() === '') return;
    this.api.sendMessage({
      type: 'message',
      text: this.state.text,
      nickname: this.state.nickname,
      sent: Date.now()
    });
    this.setState({text:''})
  };

  renderBack = () => {
    this.setState({redirectHome: true});
  };

  renderChat=(data)=>{
    let me=(this.state.nickname===data.nickname)?'right':'left';
    console.log(this.state.messages.indexOf(data));
    this.id++;
    return(
        <Message pos={me} message={data.message}/>
    )
  };

  render() {
    if(this.state.redirectHome)return <Redirect push to="/"/>;
    return (
      <Container>
        <Header backgroundColor='#d80030' style={{height: 75, paddingTop: 20}}>
          <Left>
            <Button transparent onPress={this.renderBack}>
              <Icon ios='ios-arrow-back-outline' android='md-arrow-back' />
            </Button>
          </Left>
          <Body>
          <Image source={require('../assets/img/logo-only.png')} style={{height: 45, width: 45}}/>
          <Text>HS Chat</Text>
          </Body>
          <Right/>
        </Header>
        <KeyboardAvoidingView style={styles.end} behavior='padding'>
          <FlatList style={{backgroundColor:'#0000FF', flex:1}} data={this.state.messages} renderItem={this.renderChat} />
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
