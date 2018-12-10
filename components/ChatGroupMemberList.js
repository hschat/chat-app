import React, {Component} from 'react';
import {
    Text,
    View,
    Icon,
    Thumbnail,
    Content,
    Item,
    Label,
} from "native-base";
import {StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import i18n from '../translation/i18n';
import {Col, Row, Grid} from 'react-native-easy-grid';

const styles = StyleSheet.create({
    left: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    item: {
        borderBottomWidth: 0,
    },
    list: {
        borderBottomWidth: 2,
        borderColor: '#333333',
        paddingBottom: 5,
        paddingTop: 5,
    },
    avatar: {
        marginTop: 5,
        marginBottom: 5,
        marginLeft: 5,
    },
    username: {
        textAlign: 'auto', // <-- the magic
        marginTop: 20,
    },
    deleteIcon: {
        alignItems: 'center',
        marginTop: 15,
    } 
});

export default class ChatGroupMemberList extends React.Component {

    constructor(props) {
        super(props);
        this.store = this.props.store
        this.state = {
            id: this.props.chat.id,
            editable: this.props.editable,
            isAdmin: false,
            chat: this.props.chat,
            members: [], 
        };
    };

    componentWillMount() {
        this.store.getAdminsForChat(this.state.chat).then((admins) => {
            const res = admins[0].admins.filter(adminID => adminID === this.store.user.id);
            this.setState({isAdmin: res !== undefined && res.length === 1});
        });

        this.store.completeParticipantUserInfo(this.state.chat).then((chatWithParticipants) => {
            chatWithParticipants.participants.sort(this.compare);
            this.setState({chat: chatWithParticipants, members: chatWithParticipants.participants});
        });

        this.store.app.service('chats').on('patched', updatedChat => {
            this.store.completeParticipantUserInfo(updatedChat).then((chatWithParticipants) => {
                chatWithParticipants.participants.sort(this.compare);
                this.setState({chat: chatWithParticipants, members: chatWithParticipants.participants});
            });
        });
    } 

    componentDidMount() {

        
    }

    updateGroup = (update) => {

        this.setState(update);

        this.store.updateGroup(this.state.id, update    
        ).then(() => {
            console.log('Group updated:', update);
        }).catch((error) => {
            console.error('ChatGroupMemberList, error send update', error);
        })
    };

    compare = (a, b) => {
        if (a.prename < b.prename)
            return -1;
        if (a.prename > b.prename)
            return 1;
        if (a.lastname < b.lastname)
            return -1;
        if (a.lastname > b.lastname)
            return 1;
        return 0;
    };

    renderDeleteButton = (user) => {
        return (
            <Col size={15} onPress={() => this.removeUserFromChat(user)}>
                <Icon style={styles.deleteIcon} name="ios-trash"/>
            </Col>
        )
    }

    removeUserFromChat(user) {
        console.warn('remove this user: ', user);
        /* TODO IMPL - consider using 
                a) the generic updateGroup method above (used in every group-component so far)
                b) ModalInput for "are you sure" popup (used in every popup-box so far)
        */
    } 

    _keyExtractor = (item, index) => item.id; // user.id
    renderMember = (item) => {
        let member = item.item;

        return (
            <TouchableOpacity onPress={() => {
                //this.props.navigation.navigate('View', {id: member.id});
            }}>
                <Grid style={styles.list}>
                    <Col>
                        <Row>
                            <Col size={25} style={styles.avatar}>
                                <Thumbnail
                                    source={{uri: `https://api.adorable.io/avatars/200/${member.email}.png`}}/>
                            </Col>
                            <Col size={60}>
                                <Text style={styles.username}>{member.prename} {member.lastname}</Text>
                            </Col>
                            {this.state.isAdmin ? this.renderDeleteButton(member) : null} 
                        </Row>
                    </Col>
                </Grid>
            </TouchableOpacity>
        )
    };

    render() {
        if (this.state.members.length === 0) {
            return (
                <View>
                    <Text>Keine Mitglieder</Text>
                </View>
            )
        }
        return (
            <View>
                <Item stackedLabel style={{borderBottomWidth: 2, borderColor: '#333333',}}>
                    <Label style={{fontSize: 18, marginTop: 5,}}>
                                Mitglieder
                    </Label>
                </Item>
                <Content>
                    <FlatList data={this.state.members} extraData={this.state.members} renderItem={this.renderMember} keyExtractor={this._keyExtractor}/>
                </Content>
            </View>
        );
    }
}
