import React from 'react';
import { createStore } from 'redux';
import {View, StyleSheet, Image} from 'react-native';
import {Redirect} from 'react-router-native';
import {FormInput, Button, Header} from 'react-native-elements'

import {Chat} from './chat'
import LoadingIcon from "../components/loadingIcon";
import ChatAPI from "../ChatAPI";

const styles = StyleSheet.create({
  middle: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center'
  },
  backgroundImage: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'cover'
  }
});

export default class Hello extends React.Component {



  constructor(props) {
    super(props);
    this.api = new ChatAPI();
    this.state = {
      name: '',
      loaded: false,
      joined: false
    };
  }

  componentWillMount() {
    this.api.on('connect', (state) => {this.setState({loaded: true});})
  }

  setName = (n) => {
    this.setState({name: n})
  };

  send = () => {
    let data = {
      type: 'join',
      nickname: this.state.name,
      sent: Date.now()
    };

    this.api.sendMessage(data, (data) => {
      console.log(data);

      if (data.type === 'join' && data.success)
        this.setState({joined: data.success})

    });
  };


  render() {
    return this.state.joined ? (
      <Redirect to="/chat"/>
    ) : (
      !this.state.loaded ? (
        <LoadingIcon/>
      ) : (
        <View style={{flex: 1}}>
          <Image source={require('../assets/img/bg.png')} style={styles.backgroundImage}>
            <Header backgroundColor='#d80030'
                    centerComponent={<Image source={require('../assets/img/logo-only.png')}/>}
            />
            <View style={styles.middle}>
              <FormInput onChangeText={this.setName} ref={ref => this.formInput = ref} placeholder='#nickname'/>
              <Button
                title='Beitreten'
                onPress={this.send}
                large={false}
                rightIcon={{name: 'ios-log-in', type: 'ionicon', size: 20}}
                backgroundColor='#d80030'
                underlayColor='#B71234'
                containerViewStyle={{marginTop: 10}}
              />
            </View>
          </Image>
        </View>
      )
    )
  }
}
