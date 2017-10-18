import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeRouter, Route, Link } from 'react-router-native';

import Chat from './view/chat';


export default class App extends React.Component {
  render() {
    return (
      <NativeRouter>
        <View>
          <Route exact path='/'>
              <Chat/>
          </Route>
        </View>
      </NativeRouter>
    );
  }
}


