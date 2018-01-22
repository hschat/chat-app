import React, {Component} from 'react';
import {StyleSheet, Image, Alert, Dimensions, TouchableOpacity, Text} from 'react-native';

const styles = StyleSheet.create({});

UNITS = {
    cm: {
        short: 'cm',
        long:   'Zentimeter'
    },
    m: {
        short: 'm',
        long: 'Meter',
    },
    km: {
        short: 'km',
        long: 'Kilometer',
    }
};

export default class Distance extends Component {

    constructor(props) {
        super(props);
        this.unit = UNITS.m;
        this.distance = this.props.distance;
    }

    componentWillMount() {

        if(this.distance>1000){
            this.unit=UNITS.km;
            this.distance=this.distance/1000
        }
        if(this.distance<1){
            this.unit=UNITS.cm;
            this.distance=this.distance*100;
        }
    }

    render() {
        let d=Math.round(this.distance);

        return (
            <Text>{d} {this.props.long ? this.unit.long : this.unit.short}</Text>
        )
    }

}
