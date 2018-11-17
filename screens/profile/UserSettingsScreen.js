import React, {Component} from 'react';
import {
    Text,
    View,
    Button,
    H3,
    Icon,
    Item,
    ListItem,
    Content,
    Label,
    Input,
    Form,
    CheckBox,
    List,
    Body,
    Left,
    Right,
    Picker,
    Spinner,
    Switch,
    Toast,
    Thumbnail
} from "native-base";
import {StyleSheet, Image, Alert, Dimensions, TouchableOpacity} from 'react-native';
import TimeAgo from '../../components/TimeAgo';
import BaseStyles from '../../baseStyles';
import Location from '../../Location';
import Distance from '../../components/Distance';
import i18n from '../../translation/i18n';
import Expo from 'expo';

const AsyncStorage = require('react-native').AsyncStorage;

const styles = StyleSheet.create({
    image: {
        height: 100,
        borderRadius: 50,
        width: 100,
    },
    header: {
        fontWeight: 'bold'
    },
    subheader: {
        color: '#999999'
    },
    middle: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    left: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    roundedIcon: {
        backgroundColor: '#ff3232',
        padding: 10,
        borderRadius: 100,
        width: 47,
        height: 47,
    },
    item: {
        borderBottomWidth: 0,
    }
});


export default class UserSettingsScreen extends Component {

    static navigationOptions = ({navigation, screenProps}) => {
        // No logout button for other profiles
        if (navigation.state.hasOwnProperty("params") && navigation.state.params !== undefined) return {};
        return {
            headerLeft: (
                <Button onPress={() => navigation.navigate('Home')} transparent><Icon
                    name="ios-arrow-back-outline"/></Button>
            ),
            headerRight: (
                <Button onPress={screenProps.store.promptForLogout} transparent><Text>{i18n.t('UserSettingsScreen-SignOut')}</Text></Button>
            )
        }
    };

    constructor(props) {
        super(props);

        this.state = {
            user: null,
            ready: false,
            status: '',
            selected: undefined,
            checked: true,
            location: false,
            showStatusModal: false,

        };
        this.store = this.props.screenProps.store;
    }

    componentDidMount() {
        // Check if there is a user given else print your own profile
        if (this.props.navigation.state.hasOwnProperty('params') && this.props.navigation.state.params !== undefined) {
            let id = this.props.navigation.state.params.id;

            if (id !== undefined) {
                // Try to find the user else print an error
                this.store.getUserInformation(id).then(user => {
                    this.setState({user: user, ready: true});
                }).catch(error => {
                    this.setState({user: this.store.user, ready: false});
                    Alert.alert(i18n.t('UserSettingsScreen-Error'), i18n.t('UserSettingsScreen-UserNotFound'));
                });

            } else {
                this.setState({user: this.store.user, ready: true})
            }
        } else {
            this.setState({user: this.store.user, ready: true})
        }
    }

    _checkBoxHandler() {
        this.setState({checked: !this.state.checked});
        this.store.locationEnabled = this.state.checked;
    }

  onValueChange(value) {
    i18n.changeLanguage(value);
    Expo.Util.reload();
  }

    renderSettings = () => {
        return (
            <View>
                <Content>
                    <ListItem style={{width: 200}}>
                        <Body>
                        <Text>{i18n.t('UserSettingsScreen-Location')}</Text>
                        </Body>
                        <CheckBox
                            checked={this.state.checked}
                            onPress={() => this._checkBoxHandler()}
                        />
                    </ListItem>

                  <Form>
                    <Label>{i18n.t('UserSettingsScreen-ChangeLanguage')}</Label>
                    <Picker
                      mode="dropdown"
                      iosIcon={<Icon name="ios-arrow-down-outline" />}
                      placeholder={i18n.t(i18n.language)}
                      placeholderStyle={{ color: "#5267ea" }}
                      placeholderIconColor="#007aff"
                      selectedValue={this.state.selected}
                      onValueChange={this.onValueChange.bind(this)}
                    >
                      <Picker.Item label={i18n.t('de')} value="de" />
                      <Picker.Item label={i18n.t('en')} value="en" />
                      <Picker.Item label={i18n.t('es')} value="es" />
                      <Picker.Item label={i18n.t('ru')} value="ru" />
                    </Picker>
                  </Form>
                </Content>

            </View>

        )
    };

    render() {

        if (this.state.user === undefined || this.state.user === null)
            return (
                <Spinner style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center',}}
                         color='red'/>
            );

        return (
            <View
                style={{flex: 1, padding: 25, paddingTop: 15, justifyContent: 'flex-start', alignItems: 'flex-start'}}>
                <Image style={BaseStyles.backgroundImage} source={require('../../assets/img/bg.png')}/>

                <View style={{marginTop: 10}}>
                    {this.state.user.id === this.store.user.id ? this.renderSettings() : this.renderUserInformations()}
                </View>

            </View>
        );
    }
}
