import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  message: {
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    minHeight: 45,
    paddingLeft: 6,
    paddingRight: 6,
    maxWidth: '70%',
    borderWidth: 6,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 0,
  },
  leftMessage: {
    borderColor: '#d80030',
    backgroundColor: '#d80030',
  },
  rightMessage: {
    borderColor: '#00FFFF',
    backgroundColor: '#0FFFFF',
  },
  text: {
    fontSize: 16,
  },
  left: {
    alignSelf: 'flex-start',
  },
  right: {
    alignSelf: 'flex-end',
  },
});

export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = { text: '' };
  }

  render() {
    const pos = this.props.pos === 'left' ? styles.left : styles.right;
    const msgStyle = this.props.pos === 'left' ? styles.leftMessage : styles.rightMessage;
    return (
      <View style={[styles.message, pos, msgStyle]}>
        <Text style={[styles.text, { color: '#FFFFFF' }]}>{this.props.message}</Text>
      </View>
    );
  }
}
