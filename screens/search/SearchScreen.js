import React, {Component} from 'react';
import {Alert, Keyboard} from 'react-native';
import {
  Body, Button, Container, Content, Header, Icon, Input, Item, Left, List, ListItem, Spinner, Text, Thumbnail,
  View
} from "native-base";

export default class SearchScreen extends Component {
  static navigationOptions = ({navigation, screenProps}) => {
    const params = navigation.state.params || {};
    return {
      title: 'Einstellungen',
      header: (
        <Header searchBar rounded>
          <Item>
            <Icon name="ios-search"/>
            <Input placeholder="Suchen" onChangeText={(text) => params.updateState(text)} onSubmitEditing={params.search ? params.search : () => null} returnKeyLabel='Suchen'/>
            <Icon name="ios-people"/>
          </Item>
          <Button transparent onPress={params.search ? params.search : () => null}>
            <Text>Suchen</Text>
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
    if (this.state.search !== '') {
      this.setState({searched: true})
    } else {
      this.setState({searched: false})
    }
  };

  search = () => {
    this.setState({loading: true});
    Keyboard.dismiss();
    this.store.findUser(this.state.search).then((users) => {
      this.setState({users: users});
      this.setState({loading: false});
    }).catch(error => {
      console.error('Search error:', error);
      Alert.alert('Fehler', error.message, [
        {
          text: 'Ok', onPress: () => {
          this.setState({loading: false});
        }
        }
      ]);
    });
  };

  /**
   *
   * @param user
   * @returns {XML}xy
   */
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

    if (this.state.searched && this.state.users.length === 0) {
      return (
        <Content>
          <List>
            <ListItem style={{backgroundColor: 'transparent'}}>
              <Body>
              <Text>Es wurde kein Benutzer gefunden</Text>
              <Text note>Möchtest du den Benutzer einladen?</Text>
              </Body>
            </ListItem>
          </List>
        </Content>
      );
    }

    return (<Content><List dataArray={this.state.users} renderRow={this.renderSearchResult}></List></Content>);
  }
}
