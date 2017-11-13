import React from 'react';
import {NativeRouter, Router, Switch, Route} from 'react-router-native';
import {Root} from 'native-base';
import ChatApi from './ChatAPI';

import Chat from './view/chat';
import Hello from './view/hello';
import SignUp from './view/auth/signup'
import LoadingIcon from "./components/loadingIcon";

export default class App extends React.Component {

  constructor() {
    super();
    this.state = {
      isReady: false
    };
  }

  async componentWillMount() {
    await Expo.Font.loadAsync({
      'Roboto': require('native-base/Fonts/Roboto.ttf'),
      'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
    });
    let v = new ChatApi();
    this.setState({isReady: true});
  }

  render() {
    if (this.state.isReady) {
      return (
          <Root>
            <NativeRouter>
              <Switch>
                <Route exact path='/'>
                  <Hello/>
                </Route>
                <Route exact path='/chat'>
                  <Chat/>
                </Route>
                  <Route exact path='/auth/signup'>
                      <SignUp/>
                  </Route>
              </Switch>
            </NativeRouter>
          </Root>
      );
    } else {
      return <LoadingIcon/>;
    }
  }
}


