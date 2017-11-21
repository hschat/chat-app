import React, {Component} from 'react';
import {Text, View} from "native-base";
import NavIcons from "../components/NavIcons";

export default class ChatsScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    title: 'Settings',
    headerLeft: NavIcons.closeButton(navigation.goBack)
  });

  render() {
    return (<View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>ChatsScreen</Text>
    </View>
    );
  }
}