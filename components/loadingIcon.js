import React from 'react';
import {View, StyleSheet, Animated, Easing, Image, Text} from 'react-native';
import { Icon } from 'native-base'



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

    constructor(props) {
        super(props);
        this.ready=false;
        this.spinValue = new Animated.Value(0);
    }

    componentDidMount(){
        this.spin()
    }

    spin=()=>{
        this.spinValue.setValue(0)
        Animated.timing(
            this.spinValue,
            {
                toValue: 1,
                duration: 4000,
                easing: Easing.linear
            }
        ).start(() => this.spin())
    };

    render(){
        const spin = this.spinValue.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg']
        });
        return(
            <Image source={require('../assets/img/bg.png')} style={styles.backgroundImage}>
                <View style={styles.middle}>
                <Animated.View
                    style={{ transform: [{rotate: spin}] }} >
                    <Icon name='spinner-3' type='evilicon' iconStyle={[{fontSize: 48, color: '#d80030'}, this.props.style]}/>
                </Animated.View>
                <Text style={[styles.font, styles.transparentBackground]}>Loading...</Text>
                </View>
            </Image>
        )


    }
}