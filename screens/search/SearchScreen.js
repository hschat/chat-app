import React, {Component} from 'react';
import {Alert, Keyboard} from 'react-native';
import {
  Body, Button, Container, Content, Header, Icon, Input, Item, Left, List, ListItem, Text, Thumbnail,
  View
} from "native-base";
import NavIcons from "../../components/NavIcons";

export default class SearchScreen extends Component {
  static navigationOptions = ({navigation, screenProps}) => {
    const params = navigation.state.params || {};
    return {
      title: 'Einstellungen',
      header: (
        <Header searchBar rounded>
          <Item>
            <Icon name="ios-search"/>
            <Input placeholder="Suchen" onChangeText={(text) => params.updateState(text)}/>
            <Icon name="ios-people"/>
          </Item>
          <Button transparent onPress={params.search ? params.search : () => null}>
            <Text>Search</Text>
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
      users: []
    };

    this.props.navigation.setParams({
      updateState: this._updateSearch,
      search: this.search
    });
  }

  _updateSearch = (searchText) => this.setState({search: searchText});

  search = () => {
    this.store.findUser(this.state.search).then((users) => {
      this.setState({users: users});
      Keyboard.dismiss();
    }).catch(error => {
      console.log(error);
      Alert.alert('Fehler', error.message);
    });
  };

  /**
   *
   * @param user
   * @returns {XML}
   */
  renderSearchResult = (user) => {
    return (
      <ListItem avatar style={{backgroundColor: 'transparent'}} button={true} onPress={() => {
        console.log(user);
        this.props.navigation.navigate('Profile', {id: user.id})
      }}>
        <Left>
          <Thumbnail source={{uri: 'https://api.adorable.io/avatars/200/' + user.email + '.png'}}/>
        </Left>
        <Body>
        <Text>{user.prename} {user.lastname}</Text>
        <Text note>Doing what you like will always keep you happy . .</Text>
        </Body>
      </ListItem>
    )
  };

  /**
   *
   * @returns {XML}
   */
  render() {
    return (
      <Content>
        <List dataArray={this.state.users} renderRow={this.renderSearchResult}></List>
      </Content>
    );
  }
}