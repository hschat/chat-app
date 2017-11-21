import React, {Component} from 'react';
import {Text, View} from "native-base";
import NavIcons from "../components/NavIcons";
import {TouchableOpacity} from "react-native";

export default class ProfileScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    title: 'Profile',
    headerLeft: NavIcons.closeButton(navigation.goBack)
  });

  constructor(props) {
    super(props);
    this.store = this.props.screenProps.store;
  }

  render() {
    return (<View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>ProfileScreen</Text>
        <TouchableOpacity onPress={() => this.store.promptForLogout()}>
          <Text>Abmelden</Text>
        </TouchableOpacity>
    </View>
    );
  }
}