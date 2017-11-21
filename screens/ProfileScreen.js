import React, {Component} from 'react';
import {Text, View} from "native-base";
import NavIcons from "../components/NavIcons";

export default class ProfileScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    title: 'Profile',
    headerLeft: NavIcons.closeButton(navigation.goBack)
  });

  render() {
    return (<View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>ProfileScreen</Text>
    </View>
    );
  }
}