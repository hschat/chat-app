import React from 'react';
import {KeyboardAvoidingView, TextInput, StyleSheet, View, AsyncStorage, FlatList, Text } from 'react-native';
import {Link} from 'react-router-native';
import {Header, Icon} from 'native-base'

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
    return (
      <Link to='/'>
        <View>
          <Icon name='chevron-left' color='#FFFFFF'/>
        </View>
      </Link>
    );
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
    return (
      <View style={{flex: 0}}>
        <Header outerContainerStyles={{flex:1}}
                backgroundColor='#d80030'
                leftComponent={this.renderBack()}
        >
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

        </Header>
      </View>
    )
  }
}
