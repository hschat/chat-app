import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Text} from 'native-base'
import NavIcons from "../components/NavIcons";


const baseStyles = require('../baseStyles');

export default class LaunchScreen extends React.Component {
  constructor(props) {
    super(props);
    this.store = this.props.screenProps.store;
  }

  render() {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <TouchableOpacity onPress={() => this.props.navigation.navigate('Signup')}>
          <Text>Registrieren</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.props.navigation.navigate('Login')}>
          <Text>Anmelden</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.store.promptForLogout()}>
          <Text>Abmelden</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
