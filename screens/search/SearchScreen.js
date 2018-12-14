import React, {Component} from 'react';
import {Alert, Keyboard} from 'react-native';
import {
    Body, Button, Container, Content, Header, Icon, Input, Item, Left, List, ListItem, Spinner, Text, Thumbnail,
    View
} from "native-base";
import i18n from '../../translation/i18n';

export default class SearchScreen extends Component {
    static navigationOptions = ({navigation, screenProps}) => {
        const params = navigation.state.params || {};
        return {
            title: i18n.t('SearchScreen-Settings'),
            header: (
                <Header searchBar rounded>
                    <Item>
                        <Icon name="ios-search"/>
                        <Input placeholder={i18n.t('SearchScreen-Search')} onChangeText={(text) => params.updateState(text)}
                               onSubmitEditing={params.search ? params.search : () => null} returnKeyLabel={i18n.t('SearchScreen-Search')}/>
                        <Icon name="ios-people"/>
                    </Item>
                    <Button transparent onPress={params.search ? params.search : () => null}>
                        <Text>{i18n.t('SearchScreen-Search')}</Text>
                    </Button>
                </Header>
            )
        };
    };

    constructor(props) {
        super(props);

        this.store = this.props.screenProps.store;
        this.state = {
            search: '',
            users: [],
            chats: [],
            searched: false,
            loading: false
        };

        this.props.navigation.setParams({
            updateState: this._updateSearch,
            search: this.search
        });
    }

    _updateSearch = (searchText) => {
        this.setState({search: searchText});
    };

    search = () => {
        this.setState({loading: true});
        Keyboard.dismiss();
        this.store.findUser(this.state.search).then((users) => {
            this.setState({users: users});
            this.setState({loading: false});
        }).catch(error => {
            console.error('Search error:', error);
            console.error('Search error:', this.state);
        });
        this.store.findGroup(this.state.search).then((chats) => {
            this.setState({chats: chats});
            this.setState({loading: false});
        }).catch(error => {
            console.error('Search error:', error);
            console.error('Search error:', this.state);
        });
    };

    /**
     *
     * @param user
     * @returns {XML} ListItem
     **/
    renderSearchResult = (user) => {
        return (
            <ListItem avatar style={{backgroundColor: 'transparent'}} button={true} onPress={() => {
                this.props.navigation.navigate('View', {id: user.id});
            }}>
                <Left>
                    <Thumbnail source={{uri: 'https://api.adorable.io/avatars/200/' + user.email + '.png'}}/>
                </Left>
                <Body>
                <Text>{user.prename} {user.lastname}</Text>
                <Text note>{user.status}</Text>
                </Body>
            </ListItem>
        )
    };
    renderSearchResultChat = (chat) => {
        return (
            <ListItem avatar style={{backgroundColor: 'transparent'}} button={true} onPress={() => {
                this.props.navigation.navigate('GroupProfile', {chat: chat});
            }}>
                <Left>
                    <Thumbnail large
                               source={require('../../assets/img/group.png')}/>
                </Left>
                <Body>
                <Text>{chat.name}</Text>
                <Text note>{chat.description}</Text>
                </Body>
            </ListItem>
        )
    };

    /**
     *
     * @returns {XML}
     */
    render() {
        if (this.state.loading) {
            return (
                <Content>
                    <Spinner color='rgb(216, 0, 48)'/>
                </Content>
            );
        }
        if (!this.state.loading && this.state.users.length === 0 && this.state.chats.length ===0) {
            return (
                <Content>
                    <ListItem style={{backgroundColor: 'transparent'}}>
                        <Body>
                        <Text>{i18n.t('SearchScreen-UserNotFound')}</Text>
                        <Text note>{i18n.t('SearchScreen-InviteUser')}</Text>
                        </Body>
                    </ListItem>
                </Content>
            );
        }
        return (
            <Content>
                <List dataArray={this.state.users} renderRow={this.renderSearchResult}></List>
                <List dataArray={this.state.chats} renderRow={this.renderSearchResultChat}></List>
            </Content>
        );
    }
}
