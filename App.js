import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeRouter, Router, Switch, Route, Link } from 'react-router-native';

import Chat from './view/chat';
import EnterName from './view/enterName'


export default class App extends React.Component {
  render() {
    return (
        <NativeRouter>
            <Switch>
              <Route exact path='/'>
                  <EnterName/>
              </Route>
              <Route exact path='/chat'>
                  <Chat/>
              </Route>
            </Switch>
        </NativeRouter>
    );
  }
}


