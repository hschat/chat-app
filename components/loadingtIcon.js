import React from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { Icon } from 'react-native-elements'



const styles = StyleSheet.create({

});

export default class EnterName extends React.Component {

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
            <View>
                <Animated.View
                    style={{ transform: [{rotate: spin}] }} >
                    <Icon name='spinner-2' type='evilicon' iconStyle={this.props.style}/>
                </Animated.View>
            </View>

        )


    }
}