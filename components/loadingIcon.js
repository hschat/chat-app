import React from 'react';
import {View, StyleSheet, Image, Text} from 'react-native';
import {Icon, Spinner} from 'native-base'

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
  },
  font: {
    fontSize: 32
  },
  transparentBackground: {
    backgroundColor: 'rgba(0,0,0,0)',
    textAlign: 'center',
  }
});

export default class LoadingIcon extends React.Component {
  render() {
    return (
      <Image source={require('../assets/img/bg.png')} style={styles.backgroundImage}>
        <View style={styles.middle}>
          <Spinner color='#d80030'/>
          <Text style={[styles.font, styles.transparentBackground]}>Loading</Text>
        </View>
      </Image>
    )
  }
}