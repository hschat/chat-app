import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {Redirect} from 'react-router-native';
import {FormLabel, FormInput, Button, Icon} from 'react-native-elements'

import {Chat} from './chat'
import BackgroundImage from "../components/background_image";


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
    this.state = {text: '', joined: false};
  }

  log = (m) => {
    this.setState({text: m})
  };

  componentWillMount() {
    this.c = new WebSocket('wss://hsc-backend.herokuapp.com/', 'hsc-protocol');
    this.c.onopen = function () {
      console.log('Connection established...')
    };
    this.c.onerror = function (err) {
      console.log('Connection error occurred: ' + err)
    };
  }


  send = () => {
    let data = {
      type: 'join',
      nickname: this.state.text,
      sent: Date.now()
    };


    this.c.send(JSON.stringify(data));

    this.c.onmessage = (evt) => {
      console.log(evt.data);
      let data = JSON.parse(evt.data);

      if (data.type === 'join' && data.success)
        this.setState({joined: data.success})

    }
  };


  render() {
    return this.state.joined ? (
      <Redirect to="/chat"/>
    ) : (
      <View style={{flex: 1}}>
        <Image source={require('../assets/img/bg.png')} style={styles.backgroundImage}>
          <View style={styles.middle}>
            <FormInput onChangeText={this.log} ref={ref => this.formInput = ref} placeholder='#nickname'/>
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
  }
}
