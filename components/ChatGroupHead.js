import React, {Component} from 'react';
import {
    Text,
    View,
    Icon,
    Thumbnail,
    Form,
    Item,
    Label,
    H3,
} from "native-base";
import {StyleSheet, TouchableOpacity} from 'react-native';
import BaseStyles from '../baseStyles';
import i18n from '../translation/i18n';
import ModalInput from './ModalWithInput'

const styles = StyleSheet.create({
    header: {
        fontWeight: 'bold'
    },
    left: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    item: {
        borderBottomWidth: 0,
    }
});

export default class ChatGroupHead extends React.Component {

    constructor(props) {
        super(props);
        this.store = this.props.store
        this.state = {
            id: this.props.chat.id,
            name: this.props.chat.name,
            editable: this.props.editable,
            isAdmin: false,
            showGroupNameModalInput: false,
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
            console.error('ChatGrouphead, error send update', error);
        })
    };

    editableTitle = () => {
        return (
            <View>
                <ModalInput
                    text={i18n.t('ChatGroupHead-TitleText')}
                    placeholder={i18n.t('ChatGroupHead-Title-Placeholder')}
                    visible={this.state.showGroupNameModalInput}
                    input={JSON.parse(JSON.stringify(this.state.name))}  // deep copy of this.state.name
                    positiv={(name) => {
                        if(name) {
                            // not empty
                            this.updateGroup({name: name});
                        } 
                        this.setState({showGroupNameModalInput: false});
                    }}
                    negativ={() => this.setState({showGroupNameModalInput: false})}
                    maxLength={50}
                />
                <TouchableOpacity style={{width: '85%', alignItems: 'flex-start'}} onPress={() => this.setState({showGroupNameModalInput: true})}>
                    <Text 
                        style={{backgroundColor: 'transparent',
                                fontWeight: 'bold',
                                fontSize: 20,
                                color: 'black',
                                }}
                        uppercase={false}>
                        <H3 style={styles.header}>{this.state.name}    </H3>
                    </Text>
                </TouchableOpacity>
            </View>
        )
    };
    
    staticTitle = () => {
        return (
            <View style={[BaseStyles.transparent, {
                flexDirection: 'row',
                alignItems: 'flex-start',
                width: '85%',
            }]}>
                <H3 style={styles.header}>{this.state.name}</H3>
            </View>
        )
    };

    render() {
        return (
            <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center',}}>
                <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center',}}
                        size={1}>
                    <Thumbnail large
                                source={require('../assets/img/group.png')}/>
                </View>
                <Form>
                    <Item stackedLabel style={[styles.item, styles.left]}>
                        <View style={{alignItems: 'flex-start', flexDirection: 'row'}}>
                            <Label style={{fontSize: 18, marginRight: 10, marginTop: 5}}  >
                                {i18n.t('ChatGroupHead-Groupname')}
                            </Label>
                            {this.state.isAdmin && this.state.editable ? <Icon style={{color: 'black'}} name="ios-create"
                                            onPress={() => this.setState({showGroupNameModalInput: true})}/> : <View/>}
                        </View>
                        <Form style={{marginTop: 0}}>
                            {this.state.isAdmin && this.state.editable ? this.editableTitle() : this.staticTitle()} 
                        </Form>
                    </Item>
                </Form>
            </View>
        );
    }
}
