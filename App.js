import React, {Component} from 'react';
import {Root, View, Text, Spinner} from 'native-base';
import DropdownAlert from 'react-native-dropdownalert';


import ApiStore from "./ApiStore";
import MainNavigator from "./components/MainNavigator";
import UnauthenticatedNavigator from "./components/LaunchNavigator";
import {autobind} from "core-decorators";
import {observer} from "mobx-react";
import {observe} from "mobx";
import {NavigationActions} from 'react-navigation';
import Location from './Location'
import Sentry from 'sentry-expo';

if (process.env.SENTRY_DSN) {
  Sentry.config(process.env.SENTRY_DSN).install();
}

@autobind @observer
export default class App extends Component {

  constructor(props) {
    super(props);
    this.store = new ApiStore();
    observe(this.store, "alert", this.showAlert, true);
    this.state={font: false};
    new Location();
  }

  async componentWillMount() {
    await Expo.Font.loadAsync({
      'Roboto': require('native-base/Fonts/Roboto.ttf'),
      'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
    });
    this.setState({font: true});
  }


  showAlert = () => {
    if (Object.keys(this.store.alert).length === 0) return;
    this.dropdown.alertWithType(this.store.alert.type, this.store.alert.title, this.store.alert.msg);

  };

  onClose(data) {
    if (data.action === 'tap') {
      // user taped on the dropdown
      if (this.store.alert.hasOwnProperty('chat_id')) {
        // if a chat_id is set try to navigate to the view
        this.store.findChat(this.store.alert.chat_id).then((chat) => {
          console.log(chat);
          this.navigator && this.navigator.dispatch(
            NavigationActions.navigate(
              {
                routeName: 'Chats',
                action: NavigationActions.navigate({routeName: 'Chat', params: {chat: chat[0]}})
              })
          );
        });
      }
    }
    //Clear the store
    this.store.alert = {};
  }

  render() {
      if(!this.state.font){
          return(
              <Spinner style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center',}}
                       color='red'/>
          )
      }
    return (
      <View style={{flex: 1}}>
        <DropdownAlert
          ref={ref => this.dropdown = ref}
          onClose={data => this.onClose(data)}
          zIndex={10}
        />
        <Root>
          {
            this.store.isAuthenticated ?
                <MainNavigator ref={nav => {
                  this.navigator = nav;
                }} screenProps={{store: this.store}}/> :
              <UnauthenticatedNavigator screenProps={{store: this.store}}/>
          }
        </Root>
      </View>
    );
  }
}
