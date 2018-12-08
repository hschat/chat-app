import React, {Component} from 'react';
import {
    Text,
    View,
    Icon,
    Form,
    Item,
    Label,
} from "native-base";
import {StyleSheet, TouchableOpacity} from 'react-native';
import BaseStyles from '../baseStyles';
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

export default class ChatGroupInformation extends React.Component {

    constructor(props) {
        super(props);
        this.store = this.props.store
        this.state = {
            id: this.props.chat.id,
            description: this.props.chat.description,
            userCount: this.props.chat.participants.length,
            editable: this.props.editable,
            isAdmin: false,
            showGroupNameModalInput: false,
            showGroupDescriptionModalInput: false,
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
            console.error('ChatGroupInformation, error send update', error);
        })
    };

    editableDescription = () => {
        return (
            <View>
                <ModalInput
                    text={i18n.t('ChatGroupInformation-DescriptionText')}
                    placeholder={i18n.t('ChatGroupInformation-Description-Placeholder')}
                    visible={this.state.showGroupDescriptionModalInput}
                    input={JSON.parse(JSON.stringify(this.state.description))}  // deep copy of this.state.description
                    positiv={(description) => {
                        this.updateGroup({description: description});
                        this.setState({showGroupDescriptionModalInput: false});
                    }}
                    negativ={() => this.setState({showGroupDescriptionModalInput: false})}
                    maxLength={340}
                    multiline={true} 
                />
                <TouchableOpacity style={{alignItems: 'flex-start', flexDirection: 'row'}} onPress={() => this.setState({showGroupDescriptionModalInput: true})}>
                    <Text   style={{backgroundColor: 'transparent',
                                    fontSize: 12, 
                                    color: 'black',
                                    width: '100%'}} 
                            uppercase={false}>
                        {this.state.description}
                    </Text>
                </TouchableOpacity>
            </View>
        )
    };
    
    staticDescription = () => {
        return (
            <View style={[BaseStyles.transparent, {
                flexDirection: 'row',
                alignItems: 'flex-start',
                marginLeft: 0,
                width: '100%',
            }]}>
                <Label>{this.state.description}</Label>
            </View>
        )
    };

    render() {
        return (
            <View>
                <Item stackedLabel style={[styles.item, styles.left]}>
                    <View style={{alignItems: 'flex-start', flexDirection: 'row'}}>
                        <Label style={{fontSize: 18, marginRight: 10, marginTop: 5}}  >
                            {i18n.t('ChatGroupInformation-Describtion')}
                        </Label>
                        {this.state.isAdmin && this.state.editable ? <Icon style={{color: 'black'}} name="ios-create"
                                onPress={() => this.setState({showGroupDescriptionModalInput: true})}/> : <View/>}
                    </View>
                    <Form style={{marginTop: 10}}>
                        {this.state.isAdmin && this.state.editable ? this.editableDescription() : this.staticDescription()}
                    </Form>
                </Item>
                <Item stackedLabel style={[styles.item, styles.left]}>
                    <View style={{alignItems: 'flex-start', flexDirection: 'row'}}>
                        <Label style={{fontSize: 18, marginRight: 10, marginTop: 5}}  >
                            {i18n.t('ChatGroupInformation-UserCount')}: {this.state.userCount}
                        </Label>
                    </View>
                </Item>
            </View>
        );
    }
}
