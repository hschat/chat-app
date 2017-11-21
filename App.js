import React, {Component} from 'react';
import {Root, View} from 'native-base';

import ApiStore from "./ApiStore";
import MainNavigator from "./components/MainNavigator";
import UnauthenticatedNavigator from "./components/LaunchNavigator";
import {autobind} from "core-decorators";
import {observer} from "mobx-react";

@autobind @observer
export default class App extends Component {

  constructor(props) {
    super(props);
    this.store = new ApiStore();
  }

  async componentWillMount() {
    await Expo.Font.loadAsync({
      'Roboto': require('native-base/Fonts/Roboto.ttf'),
      'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
    });
  }

  render() {
    return (
      <Root>
        {
          this.store.isAuthenticated ? <MainNavigator screenProps={{store: this.store}}/> :
            <UnauthenticatedNavigator screenProps={{store: this.store}}/>
        }
      </Root>
    );
  }
}


