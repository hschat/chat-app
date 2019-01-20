import React, {Component} from 'react';
import {
    View,
    Button,
    Icon,
    Form,
    Item,
    Label,
    Toast,
    Text,
} from "native-base";
import {StyleSheet, Image, ScrollView} from 'react-native';
import BaseStyles from '../../baseStyles';
import i18n from '../../translation/i18n';
import ModalInput from '../../components/ModalWithInput';
import ChatGroupHead from '../../components/ChatGroupHead';
import ChatGroupInformation from '../../components/ChatGroupInformation';
import ChatGroupMemberList from '../../components/ChatGroupMemberList';

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

export default class ChatGroupProfile extends React.Component {

    constructor(props) {
        super(props);
        this.store = this.props.screenProps.store;
        let isMember = false;
        for (let index = 0; index < this.props.navigation.state.params.chat.participants.length; index++) {
            if(this.props.navigation.state.params.chat.participants[index].id === this.store.user.id){
                isMember = true
                break;
            }
        }
        this.state = {
            editable : false,
            isMember: isMember,
            showPasswordModal: false,
            password: '',
        }
    }

    static navigationOptions = ({navigation, screenProps}) => {
        return {
            headerTitle: i18n.t('ChatGroupProfile-Header'),
            headerLeft: (
                <Button onPress={() => navigation.navigate('Home')} transparent><Icon
                    name="ios-arrow-back-outline"/></Button>
            )
        }
    };

    toastIt = (text, type) => {
        Toast.show({
            text: text,
            position: 'top',
            textStyle: {flex: 1, textAlign: 'center'},
            type: type,
            duration: 2000
        })
    };

    checkPassword = (password) =>{
        const currentChat = this.props.navigation.state.params.chat;
        const currentUser = this.store.user;
        let toastMessage;
        if(currentChat.selfmanaged_password === password){
            this.store.enterWithUserGroupPassword(currentChat,currentUser).then(() =>{
                toastMessage = i18n.t('ChatGroupProfile-EnterSuccessMessage');
                this.toastIt(toastMessage,'success');
                this.hidePasswordModal();
                return;
            });
            
        }
        toastMessage = i18n.t('ChatGroupProfile-EnterFailMessage');
        this.toastIt(toastMessage,'warning');
        this.hidePasswordModal();
        return;
        
    };

    showPasswordModal = () =>{
        this.setState({showPasswordModal: true})
    };

    hidePasswordModal = () =>{
        this.setState({showPasswordModal: false})
    };

    render() {
        return (
            <View style={{flex: 1, paddingLeft: 25, paddingTop: 15, justifyContent: 'flex-start', alignItems: 'flex-start'}}>
                <Image style={BaseStyles.backgroundImage} source={require('../../assets/img/bg.png')}/>
                <ChatGroupHead
                    chat={this.props.navigation.state.params.chat}
                    store={this.props.screenProps.store}
                    editable={this.state.editable}
                />
                <ScrollView style={{width: '100%'}}>
                    <View>
                        <Form>
                            <ChatGroupInformation
                                chat={this.props.navigation.state.params.chat}
                                store={this.props.screenProps.store}
                                editable={this.state.editable}
                            />
                            <View>
                                <Item stackedLabel style={[styles.item, styles.left]}>
                                <ModalInput
                                        text={i18n.t('ChatGroupProfile-ModalText')}
                                        placeholder={i18n.t('ChatGroupProfile-ModalPlaceholder')}
                                        visible={this.state.showPasswordModal}
                                        input={this.state.password}
                                        positiv={this.checkPassword}
                                        negativ={this.hidePasswordModal}
                                        maxLength={99}
                                    />
                                    <View style={{alignItems: 'flex-start', flexDirection: 'row'}}>
                                        {!this.state.isMember ? 
                                            <Button block style={BaseStyles.redButton} onPress={this.showPasswordModal}>
                                                <Text>{i18n.t('ChatGroupProfile-JoinGroup')}</Text>
                                            </Button>
                                        :
                                            <Label style={{fontSize: 15, marginRight: 10, marginTop: 0}}>
                                                {i18n.t('ChatGroupProfile-AlreadyMember')}
                                            </Label>
                                        }
                                    </View>
                                </Item>
                            </View>
                            <ChatGroupMemberList
                                chat={this.props.navigation.state.params.chat}
                                store={this.props.screenProps.store}
                                editable={this.state.editable}
                                navigation={this.props.navigation}
                            />
                        </Form>
                    </View>
                </ScrollView>
                
            </View>
        );
    }
}
