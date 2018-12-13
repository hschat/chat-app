import React, {Component} from 'react';
import {Alert, Keyboard, StyleSheet, TouchableOpacity, View, Text} from 'react-native';
import {
    Header, Input, Toast
} from "native-base";

import {Col, Row, Grid} from 'react-native-easy-grid';

import Modal from 'react-native-modal'
import {colors} from '../baseStyles'
import i18n from '../translation/i18n';

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
        borderRightWidth: 1,
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
        if(this.props.maxLength !== undefined && this.props.maxLength < input.length){
            this.toastIt( i18n.t('ModalWithInput-NotMoreThan') +  ` ${this.props.maxLength} ` + i18n.t('ModalWithInput-CharsPossible'));
        }else {
            this.setState({input: input});
        }
    };

    clear = () =>{
        this.setState({input: ''})
    }

    toastIt = (text) => {
        Toast.show({
            text: text,
            position: 'top',
            buttonText: 'ok',
            type: 'warning',
            duration: 2000
        })
    };

    render() {
        return (
            <Modal onBackButtonPress={this.close} isVisible={this.props.visible} onModalHide={this.clear}>
                <View style={styles.modal}>
                    <Grid style={styles.default}>
                        <Row size={1}>
                            <Col style={styles.middle}>
                                <Text style={styles.text}>{this.props.text}</Text>
                            </Col>
                        </Row>
                        {this.props.maxLength != 0 ? (
                        <Row>
                            <Col style={styles.middle} >
                                <Input placeholder={this.props.placeholder}
                                       onChangeText={(text) => this._updateInput(text)}
                                       value={this.state.input}
                                       multiline={this.props.multiline} 
                                />
                            </Col>
                        </Row>
                        ) : (
                        <Row size={1}>
                            <Col style={styles.middle}>
                                <Text style={styles.text}>{this.props.placeholder}</Text>
                            </Col>
                        </Row>
                        )}
                        <Row>
                            <Col style={[styles.middle, styles.spacer]}>
                                <TouchableOpacity style={[styles.middle,{flex:1}]} onPress={this.props.negativ}>
                                    <Text style={styles.button}>{i18n.t('ModalWithInput-Cancel')}</Text>
                                </TouchableOpacity>
                            </Col>
                            <Col style={[styles.middle]}>
                                <TouchableOpacity style={[styles.middle,{flex:1}]} onPress={() => {this.props.positiv(this.state.input)}}>
                                    <Text style={styles.button}>{i18n.t('ModalWithInput-OK')}</Text>
                                </TouchableOpacity>
                            </Col>

                        </Row>
                    </Grid>
                </View>
            </Modal>

        )
    }


}
