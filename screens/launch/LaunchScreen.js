import React from 'react';
import {TouchableWithoutFeedback, View, Keyboard, TouchableOpacity, Image} from 'react-native';
import {Container, Text, Button} from 'native-base'

const baseStyles = require('../../baseStyles');

export default class LaunchScreen extends React.Component {
  constructor(props) {
    super(props);
    this.store = this.props.screenProps.store;
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Image style={baseStyles.backgroundImage} source={require('../../assets/img/bg.png')}/>
          <Button onPress={() => this.props.navigation.navigate('Signup')}>
            <Text>Registrieren</Text>
          </Button>
          <Button onPress={() => this.props.navigation.navigate('Login')}>
            <Text>Anmelden</Text>
          </Button>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}
