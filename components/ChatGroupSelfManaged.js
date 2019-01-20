import React, {Component} from 'react';
import {
    Text,
    View,
    Icon,
    Form,
    Item,
    Label,
    CheckBox,
} from "native-base";
import {StyleSheet, TouchableOpacity} from 'react-native';
import i18n from '../translation/i18n';
import ModalInput from './ModalWithInput'

const styles = StyleSheet.create({
    left: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    item: {
        borderBottomWidth: 0,
    }
});

export default class ChatGroupSelfManaged extends React.Component {

    constructor(props) {
        super(props);
        this.store = this.props.store
        this.state = {
            id: this.props.chat.id,
            editable: this.props.editable,
            isAdmin: false,
            showSelfmanagedPasswordModalInput: false,
            // selfmanaged_options
            selfmanaged_password: this.props.chat.selfmanaged_password || '', // must not be undefined
            is_selfmanaged: this.props.chat.is_selfmanaged,
        };

        this.store.getAdminsForChat(this.props.chat).then((admins) => {
            const res = admins[0].admins.filter(adminID => adminID === this.store.user.id);
            this.setState({isAdmin: res !== undefined && res.length === 1});
        });

    };

    updateGroup = (update) => {

        this.setState(update);

        this.store.updateGroup(this.state.id, update    
        ).then(() => {
            console.log('Group updated:', update);
        }).catch((error) => {
            console.error('ChatGroupSelfManaged, error send update', error);
        })
    };

    // Password option
    renderSelfmanagedOptionPassword = () => {
        return (
            <View>
                <ModalInput
                    text={i18n.t('ChatGroupSelfManaged-PasswordText')}
                    placeholder={i18n.t('ChatGroupSelfManaged-Password-Placeholder')}
                    visible={this.state.showSelfmanagedPasswordModalInput}
                    input={JSON.parse(JSON.stringify(this.state.selfmanaged_password))}  // deep copy of this.state.selfmanaged_password
                    positiv={(selfmanaged_password) => {
                        if(selfmanaged_password) {
                            // not empty
                            this.updateGroup({selfmanaged_password: selfmanaged_password});
                        } 
                        this.setState({showSelfmanagedPasswordModalInput: false});
                    }}
                    negativ={() => this.setState({showSelfmanagedPasswordModalInput: false})}
                />
                <TouchableOpacity style={{alignItems: 'flex-start', flexDirection: 'row'}} onPress={() => this.setState({showSelfmanagedPasswordModalInput: true})}>
                    <Text   style={{backgroundColor: 'transparent',
                                    fontSize: 15,
                                    color: 'black',
                                    width: '100%'}} 
                            uppercase={false}>
                            {this.state.selfmanaged_password}
                </Text>
                </TouchableOpacity>
            </View>
        )
    };

    //Link option
    renderSelfmanagedOptionLink = () => {
        return (
            <Item stackedLabel style={[styles.item, styles.left]}>
                <View style={{alignItems: 'flex-start', flexDirection: 'row'}}>
                    <Label style={{fontSize: 18, marginRight: 10, marginTop: 5, fontWeight: 'bold'}}  >
                        {i18n.t('ChatGroupSelfManaged-Link')}
                    </Label>
                </View>
                <View style={{alignItems: 'flex-start', flexDirection: 'row'}}>
                    <Label style={{fontSize: 15, marginRight: 10, marginTop: 5}}  >
                        www.hschat.de/group.html?fitzlibutzli=123
                    </Label>
                </View>
            </Item>
        )
    };

    // Whole selfmanaged options
    renderSelfmanagedArea = () => {
        return (
            <Item stackedLabel style={[styles.item, styles.left]}>
                <View style={{alignItems: 'flex-start', flexDirection: 'row', top: 20, bottom: 20}}>
                    <Label style={{fontSize: 18, marginRight: 10, fontWeight: 'bold'}}>
                        {i18n.t('ChatGroupSelfManaged-Selfmanaged')}
                    </Label>
                    <CheckBox
                        checked={this.state.is_selfmanaged}
                        onPress={() => this.updateGroup({is_selfmanaged: !this.state.is_selfmanaged})}
                    />
                </View>
            </Item>
        )
    };

    render() {
        return (
            <View>
                {this.state.isAdmin && this.state.editable ? this.renderSelfmanagedArea(): <Item style={[styles.item]}/>}
                {this.state.is_selfmanaged && this.state.isAdmin && this.state.editable ? 
                    <Item stackedLabel style={[styles.item, styles.left]}>
                        <View style={{alignItems: 'flex-start', flexDirection: 'row'}}>
                            <Label style={{fontSize: 18, marginRight: 10, marginTop: 5, fontWeight: 'bold'}}  >
                                {i18n.t('ChatGroupSelfManaged-Password')}
                            </Label>
                            <Icon style={{color: 'black'}} name="ios-create"
                                    onPress={() => this.setState({showSelfmanagedPasswordModalInput: true})}/>
                        </View>
                        <Form style={{marginTop: 10}}>
                            {this.renderSelfmanagedOptionPassword()}
                        </Form>
                    </Item>
                : <Item style={[styles.item]}/>}
                {this.state.is_selfmanaged && this.state.isAdmin && this.state.editable ? this.renderSelfmanagedOptionLink() : <Item style={[styles.item]}/>}
            </View>
        );
    }
}
