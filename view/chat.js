import React from 'react';
import {KeyboardAvoidingView, TextInput, StyleSheet, View, AsyncStorage } from 'react-native';
import {Header, Icon} from 'react-native-elements'
import {Link} from 'react-router-native';

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
      messages: []
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
    this.api.sendMessage({
      type: 'message',
      text: this.state.text,
      nickname: this.state.nickname,
      sent: Date.now()
    });
  };

  renderBack = () => {
    return (
      <Link to='/'>
        <View>
          <Icon name='chevron-left' color='#FFFFFF'/>
        </View>
      </Link>
    );
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <Header backgroundColor='#d80030'
                leftComponent={this.renderBack()}
        />
        <KeyboardAvoidingView style={styles.end} behavior='padding'>
          {this.state.messages.map((el) => {
            <Message pos='left' message={el.text}/>
          })}
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              onChangeText={(text) => this.setState({text})}
              value={this.state.text}
            />
            <Icon containerStyle={{width: '10%'}} name='send' color='#FF0000' onPress={this.send}/>

          </View>
        </KeyboardAvoidingView>
      </View>
    )
  }
}
