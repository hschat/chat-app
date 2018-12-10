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

        this.store.getAdminsForChat(this.state.chat).then((admins) => {
            const res = admins[0].admins.filter(adminID => adminID === this.store.user.id);
            this.setState({isAdmin: res !== undefined && res.length === 1});
        });

        this.store.completeParticipantUserInfo(this.state.chat).then((chatWithParticipants) => {
            this.setState({chat: chatWithParticipants, members: chatWithParticipants.participants});
            console.log(this.state.members);
            this.state.members.sort(this.compare);
        });
        
    };

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
            <TouchableOpacity onPress={() => this.removeUserFromChat(user)}>
                <Col size={1}>
                    <Icon style={{color: 'black'}} name="ios-trash"/>
                </Col>
            </TouchableOpacity>
        )
    }

    removeUserFromChat(user) {
        console.warn('remove this user: ', user);
        // TODO IMPL - consider using the generic updateGroup method above (used in every group-component so far)
    } 

    _keyExtractor = (item, index) => index;
    renderMember = (item) => {
        console.log(item);
        let member = item.item;

        return (
            <TouchableOpacity onPress={() => {
                this.props.navigation.navigate('View', {id: member.id});
            }}>
                <Grid style={styles.list}>
                    <Col>
                        <Row>
                            <Col size={1}>
                                <Thumbnail
                                    source={{uri: `https://api.adorable.io/avatars/200/${member.email}.png`}}/>
                            </Col>
                            <Col size={1}>
                                <Text>{member.prename} {member.lastname}</Text>
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
                    
                </View>
            )
        }
        return (
            <View>
                <Item>
                    <Label style={{fontSize: 18, marginRight: 10, marginTop: 5}}>
                                Mitglieder
                    </Label>
                </Item>
                <Content>
                    <FlatList data={this.state.members} extraData={this.state} renderItem={this.renderMember} keyExtractor={this._keyExtractor}/>
                </Content>
            </View>
        );
    }
}
