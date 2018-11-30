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
    Input,
} from "native-base";
import {StyleSheet, Image, TextInput} from 'react-native';
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
            selfmanaged_password: this.props.navigation.state.params.chat.password,
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

    /*
    FIXME:  Editable Description 
                ...color is blue
                ...multiple lines of text do not resize properly
            Editable Name and Description
                ...gets always toUppercase?!
            Design
                ...better way than white background to indicate editability?
            Translation
                ...add to this class
    */

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
                <Button style={{flexDirection: 'row',}} transparent onPress={() => this.setState({showGroupDescriptionModalInput: true})}>
                    <Text style={{backgroundColor: 'transparent',
                                  fontSize: 12, color: 'black'}}>
                        {this.state.description}
                    </Text>
                    <Icon style={{color: 'black'}} name="ios-create"/>
                </Button>
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
                <Button style={{flexDirection: 'row',}} transparent onPress={() => this.setState({showGroupNameModalInput: true})}>
                    <Text style={{backgroundColor: 'transparent',
                                  fontWeight: 'bold',
                                  fontSize: 20,
                                  color: 'black'}}>{this.state.name}</Text>
                    <Icon style={{color: 'black'}} name="ios-create"/>
                </Button>
            </View>
        )
    };
    
    staticTitle = () => {
        return (
            <View style={[BaseStyles.transparent, {
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'flex-start',
                marginLeft: 5,
                width: '85%',
            }]}>
                <H3 style={styles.header}>{this.state.name}</H3>
            </View>
        )
    };

    // Password and Link options
    renderSelfmanagedOptions = () => {
        return (
            <View>
                <ListItem style={{width: 200}}>
                    <Body>
                    <Text>{i18n.t('ChatGroupInfo-Password')}</Text>
                    </Body>
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
                    <Button style={{flexDirection: 'row',}} transparent onPress={() => this.setState({showSelfmanagedPasswordModalInput: true})}>
                        <Text style={{backgroundColor: 'transparent',
                                    fontWeight: 'bold',
                                    fontSize: 20,
                                    color: 'black'}}>{this.state.selfmanaged_password}</Text>
                        <Icon style={{color: 'black'}} name="ios-create"/>
                    </Button>
                    <Input secureTextEntry={false}
                            onChangeText={(pw) => this.updateGroup({selfmanaged_password: pw})}
                            returnKeyType='done'
                            placeholder={this.state.selfmanaged_password}
                            autoCapitalize='none'/>
                </ListItem>
                <ListItem style={{width: 200}}>
                    <Body>
                    <Text>{i18n.t('ChatGroupInfo-Link')}</Text>
                    </Body>
                    <Text>Link-Dummy</Text>
                </ListItem>
            </View>
        )
    };

    // Whole selfmanaged options
    renderSelfmanagedArea = () => {
        return (
            <View>
                <ListItem style={{width: 200}}>
                    <Body>
                        <Text>{i18n.t('ChatGroupInfo-Selfmanaged')}</Text>
                    </Body>
                    <CheckBox
                        style={{color: 'black'}} 
                        checked={this.state.is_selfmanaged}
                        onPress={() => this.updateGroup({is_selfmanaged: !this.state.is_selfmanaged})}
                    />
                </ListItem>
                {this.state.is_selfmanaged ? this.renderSelfmanagedOptions() : <ListItem/>}
            </View>
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
                    <View style={[BaseStyles.transparent, {
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                        marginLeft: 5,
                    }]}>
                    {this.state.isAdmin ? this.editableTitle() : this.staticTitle()} 
                    </View>
                </View>
                <Form>
                    <Item stackedLabel style={[styles.item, styles.left]}>
                        <Label style={{fontSize: 18}}  >
                            {i18n.t('ChatGroupInfo-Describtion')}
                        </Label>
                        <Form style={{marginTop: 10}}>
                           {this.state.isAdmin ? this.editableDescription() : this.staticDescription()} 
                        </Form>
                    </Item>
                    <Item stackedLabel style={[styles.item, styles.left]}>
                        <Label style={{fontSize: 18}}>{i18n.t('ChatGroupInfo-UserCount')}: {this.state.userCount} </Label>
                    </Item>
                </Form>
                {this.state.isAdmin ? this.renderSelfmanagedArea() : <View/>}
            </View>
        );
    }
}
