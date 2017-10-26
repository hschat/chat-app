import React from 'react';
import { NativeRouter, Router, Switch, Route} from 'react-router-native';

import Chat from './view/chat';
import Hello from './view/hello'
import ChatApi from './ChatAPI'

export default class App extends React.Component {

  componentWillMount() {
    let v = new ChatApi();
    //this.setState({api: });
  }

  render() {
    return (
        <NativeRouter>
            <Switch>
              <Route exact path='/'>
                  <Hello/>
              </Route>
              <Route exact path='/chat'>
                  <Chat/>
              </Route>
            </Switch>
        </NativeRouter>
    );
  }
}


