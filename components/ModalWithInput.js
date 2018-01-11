import React, {Component} from 'react';
import {Alert, Keyboard, StyleSheet, TouchableOpacity, View, Text} from 'react-native';
import {
    Header, Input
} from "native-base";

import {Col, Row, Grid} from 'react-native-easy-grid';

import Modal from 'react-native-modal'
import {colors} from '../baseStyles'


const styles = StyleSheet.create({

    modal: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#EBEBEB',
        borderRadius: 20,
        height: 150,

    },
    default: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        padding: 6,
    },
    text: {
        fontWeight: 'bold',
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
        height: 50,
    },
    button: {
        fontSize: 20,
    },
    middle: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },

    spacer: {
        borderRightWidth: 3,
        borderRightColor: '#666666',
    }

});

export default class ModalWithInput extends Component {

    constructor(props) {
        super(props);
        this.state = {
            input: '',
        }
    }
    _updateInput = (input) => {
        this.props.input=input;
    };

    render() {
        return (
            <Modal onBackButtonPress={this.close} isVisible={this.props.visible}>
                <View style={styles.modal}>
                    <Grid style={styles.default}>
                        <Row size={1}>
                            <Col style={styles.middle}>
                                <Text style={styles.text}>{this.props.text}</Text>
                            </Col>
                        </Row>
                        <Row>
                            <Col style={styles.middle}>
                                <Input placeholder='Name eingeben…' onChangeText={(text) => this._updateInput(text)}/>
                            </Col>
                        </Row>
                        <Row>
                            <Col style={[styles.middle, styles.spacer]}>
                                <TouchableOpacity style={[styles.middle,{flex:1}]} onPress={this.props.negativ}>
                                    <Text style={styles.button}>Cancel</Text>
                                </TouchableOpacity>
                            </Col>
                            <Col style={[styles.middle]}>
                                <TouchableOpacity style={[styles.middle,{flex:1}]} onPress={this.props.positiv}>
                                    <Text style={styles.button}>O.K.</Text>
                                </TouchableOpacity>
                            </Col>

                        </Row>
                    </Grid>
                </View>
            </Modal>

        )
    }


}
