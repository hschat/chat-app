import React from 'react';
import {KeyboardAvoidingView, TextInput, StyleSheet, View} from 'react-native';
import {Header, Icon} from 'react-native-elements'
import {Link} from 'react-router-native';

import Message from '../components/message'


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
  },
  navBar: {
    paddingTop: 20,
    height: 40,
    backgroundColor: '#d80030'
  },
  inputWrapper: {
    backgroundColor: '#888888',
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
    this.state = {text: '', messages: []};
  }

  send = () => {
    let data = {
      type: 'message',
      text: this.state.text,
      nickname: '',
      sent: Date.now()
    };
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
          <Message pos='left'/>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              onChangeText={(text) => this.setState({text})}
              value={this.state.text}
            />
            <Icon name='send' reverse={true} reverseColor='#FF0000' color='#FFFF' onPress={this.send}/>
          </View>
        </KeyboardAvoidingView>
      </View>
    )
  }
}
