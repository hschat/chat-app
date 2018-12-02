import React, {Component} from 'react';
import {
    Text,
    View,
    Button,
    Icon,
    Thumbnail,
    Form,
    Item,
    Label,
    H3,
    ListItem,
    Body,
    CheckBox,
} from "native-base";
import {StyleSheet, Image, TouchableOpacity, ScrollView} from 'react-native';
import BaseStyles from '../../baseStyles';
import i18n from '../../translation/i18n';
import ModalInput from '../../components/ModalWithInput'

const styles = StyleSheet.create({
    image: {
        height: 100,
        borderRadius: 50,
        width: 100,
    },
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

export default class ChatGroupInfo extends React.Component {

    constructor(props) {
        super(props);
        this.store = this.props.screenProps.store;
        this.state = {
            id: this.props.navigation.state.params.chat.id,
            name: this.props.navigation.state.params.chat.name,
            description: this.props.navigation.state.params.chat.description,
            userCount: this.props.navigation.state.params.chat.participants.length,
            isAdmin: false,
            showGroupNameModalInput: false,
            showGroupDescriptionModalInput: false,
            showSelfmanagedPasswordModalInput: false,

            // selfmanaged_options
            selfmanaged_password: this.props.navigation.state.params.chat.selfmanaged_password || '', // must not be undefined
            is_selfmanaged: this.props.navigation.state.params.chat.is_selfmanaged,
        };

        this.store.getAdminsForChat(this.props.navigation.state.params.chat).then((admins) => {
            const res = admins[0].admins.filter(adminID => adminID === this.store.user.id);
            this.setState({isAdmin: res !== undefined && res.length === 1});
        });
        
    }

    static navigationOptions = ({navigation, screenProps}) => {
        return {
            headerTitle: i18n.t('ChatGroupInfo-Header'),
            headerLeft: (
                <Button onPress={() => navigation.navigate('Chat')} transparent><Icon
                    name="ios-arrow-back-outline"/></Button>
            )
        }
    };

    updateGroup = (update) => {

        this.setState(update);

        this.store.updateGroup(this.state.id, update    
        ).then(() => {
            console.log('Group updated:', update);
        }).catch((error) => {
            console.error('ChatGroupInfo, error send update', error);
        })
    };

    editableDescription = () => {
        return (
            <View>
                <ModalInput
                    text={i18n.t('ChatGroupInfo-DescriptionText')}
                    placeholder={i18n.t('ChatGroupInfo-Description-Placeholder')}
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

    editableTitle = () => {
        return (
            <View>
                <ModalInput
                    text={i18n.t('ChatGroupInfo-TitleText')}
                    placeholder={i18n.t('ChatGroupInfo-Title-Placeholder')}
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

    // Password option
    renderSelfmanagedOptionPassword = () => {
        return (
            <View>
                <ModalInput
                    text={i18n.t('ChatGroupInfo-PasswordText')}
                    placeholder={i18n.t('ChatGroupInfo-Password-Placeholder')}
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
                                    fontSize: 12,
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
                    <Label style={{fontSize: 18, marginRight: 10, marginTop: 5}}  >
                        {i18n.t('ChatGroupInfo-Link')}
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
                    <Label style={{fontSize: 18, marginRight: 10,}}>
                        {i18n.t('ChatGroupInfo-Selfmanaged')}
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
            <View
                style={{flex: 1, padding: 25, paddingTop: 15, justifyContent: 'flex-start', alignItems: 'flex-start'}}>
                <Image style={BaseStyles.backgroundImage} source={require('../../assets/img/bg.png')}/>
                <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center',}}>
                    <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center',}}
                          size={1}>
                        <Thumbnail large
                                   source={require('../../assets/img/group.png')}/>
                    </View>
                    <Form>
                        <Item stackedLabel style={[styles.item, styles.left]}>
                            <View style={{alignItems: 'flex-start', flexDirection: 'row'}}>
                                <Label style={{fontSize: 18, marginRight: 10, marginTop: 5}}  >
                                    {i18n.t('ChatGroupInfo-Groupname')}
                                </Label>
                                {this.state.isAdmin ? <Icon style={{color: 'black'}} name="ios-create"
                                                onPress={() => this.setState({showGroupNameModalInput: true})}/> : <View/>}
                            </View>
                            <Form style={{marginTop: 0}}>
                                {this.state.isAdmin ? this.editableTitle() : this.staticTitle()} 
                            </Form>
                        </Item>
                    </Form>
                </View>
                <ScrollView style={{width: '100%'}}>
                    <View>
                        <Form>
                            <Item stackedLabel style={[styles.item, styles.left]}>
                                <View style={{alignItems: 'flex-start', flexDirection: 'row'}}>
                                    <Label style={{fontSize: 18, marginRight: 10, marginTop: 5}}  >
                                        {i18n.t('ChatGroupInfo-Describtion')}
                                    </Label>
                                    {this.state.isAdmin ? <Icon style={{color: 'black'}} name="ios-create"
                                            onPress={() => this.setState({showGroupDescriptionModalInput: true})}/> : <View/>}
                                </View>
                                <Form style={{marginTop: 10}}>
                                    {this.state.isAdmin ? this.editableDescription() : this.staticDescription()}
                                </Form>
                            </Item>
                            <Item stackedLabel style={[styles.item, styles.left]}>
                                <View style={{alignItems: 'flex-start', flexDirection: 'row'}}>
                                    <Label style={{fontSize: 18, marginRight: 10, marginTop: 5}}  >
                                        {i18n.t('ChatGroupInfo-UserCount')}: {this.state.userCount}
                                    </Label>
                                </View>
                            </Item>
                            {this.state.isAdmin ? this.renderSelfmanagedArea(): <Item/>}
                            {this.state.is_selfmanaged && this.state.isAdmin ? 
                                <Item stackedLabel style={[styles.item, styles.left]}>
                                    <View style={{alignItems: 'flex-start', flexDirection: 'row'}}>
                                        <Label style={{fontSize: 18, marginRight: 10, marginTop: 5}}  >
                                            {i18n.t('ChatGroupInfo-Password')}
                                        </Label>
                                        <Icon style={{color: 'black'}} name="ios-create"
                                                onPress={() => this.setState({showSelfmanagedPasswordModalInput: true})}/>
                                    </View>
                                    <Form style={{marginTop: 10}}>
                                        {this.renderSelfmanagedOptionPassword()}
                                    </Form>
                                </Item>
                            : <Item/>}
                            {this.state.is_selfmanaged && this.state.isAdmin ? this.renderSelfmanagedOptionLink() : <Item/>}
                        </Form>
                    </View>
                </ScrollView>
            </View>
        );
    }
}
