import React, {Component} from 'react';
import {
  StyleSheet, Image, Alert, Dimensions, TouchableOpacity,
} from 'react-native';
import {Text} from 'native-base';
import i18n from '../translation/i18n';

const styles = StyleSheet.create({});

MAX_CHARS = 50;

export default class LastChatMessage extends Component {
  constructor(props) {
    super(props);
    this.store = this.props.store;
    this.state = {
      text: i18n.t('LastChatMessage-Loading'),
    };
  }


  componentWillMount() {
    //Load the last msg
    this.store.getLastMessageForChat(this.props.chat).then(msg => {
      if (msg !== undefined && !msg.system)
        this.setState({text: msg.text});
      else
        this.setState({text: i18n.t('LastChatMessage-noMessage')})
    });
    //Set a listener for changes
    this.store.app.service('messages').on('created', () => {
      this.store.getLastMessageForChat(this.props.chat).then(msg => {
        this.setState({text: msg.text});
      });
    });
  }

  render() {
    let text = this.state.text;
    const i = text.indexOf('\n');
    if (i !== -1) text = text.substring(0, i);
    if (text.length > MAX_CHARS) text = `${text.substring(0, MAX_CHARS)}...`;
    return (
      <Text {...this.props} note>{text}</Text>
    );
  }
}
