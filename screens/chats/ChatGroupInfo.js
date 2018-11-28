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
    Textarea
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
        };

        this.store.getAdminsForChat(this.props.navigation.state.params.chat).then((admins) => {
            const res = admins[0].admins.filter(a => a.id !== this.store.user.id);
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
                    text='Geb deine neue Beschreibung für die Gruppe ein'
                    placeholder='Beschreibung...'
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
                <Button transparent onPress={() => this.setState({showGroupDescriptionModalInput: true})}>
                    <Text style={{backgroundColor: 'transparent',
                                  fontWeight: 'bold',
                                  fontSize: 12,
                                  color: 'black'}}>{this.state.description}</Text>
                </Button>
            </View>
        )
    };
    
    staticDescription = () => {
        return (
            <Label style={{ backgroundColor: 'transparent',
                            fontWeight: 'bold',
                            fontSize: 23,
                            flex: 1}}>
                {this.state.description}
            </Label>
        )
    };

    editableTitle = () => {
        return (
            <View>
                <ModalInput
                    text='Geb deinen neuen Namen für die Gruppe ein'
                    placeholder='Name...'
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
                <Button transparent onPress={() => this.setState({showGroupNameModalInput: true})}>
                    <Text style={{backgroundColor: 'transparent',
                                  fontWeight: 'bold',
                                  fontSize: 20,
                                  color: 'black'}}>{this.state.name}</Text>
                </Button>
            </View>
        )
    };
    
    staticTitle = () => {
        return (
            <Label style={{ backgroundColor: 'transparent',
                            fontWeight: 'bold',
                            fontSize: 23,
                            flex: 1}}>
                {this.state.name}
            </Label>
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
                        <Label>
                            {i18n.t('ChatGroupInfo-Describtion')}
                        </Label>
                        <Form style={{marginTop: 20}}>
                           {this.state.isAdmin ? this.editableDescription() : this.staticDescription()} 
                        </Form>
                    </Item>
                    <Item stackedLabel style={[styles.item, styles.left]}>
                        <Label>{i18n.t('ChatGroupInfo-UserCount')}: {this.state.userCount} </Label>
                    </Item>
                </Form>
            </View>
        );
    }
}
