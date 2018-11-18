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
    Spinner,
    Switch,
    Toast,
    Thumbnail
} from "native-base";
import {StyleSheet, Image, Alert, Dimensions, TouchableOpacity} from 'react-native';
import TimeAgo from '../../components/TimeAgo';
import BaseStyles from '../../baseStyles';
import Distance from '../../components/Distance'
import ModalInput from '../../components/ModalWithInput'
import {NavigationActions, SafeAreaView} from 'react-navigation';
import i18n from '../../translation/i18n';


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


export default class ProfileScreen extends Component {

    static navigationOptions = ({navigation, screenProps}) => {
        // No logout button for other profiles
        if (navigation.state.hasOwnProperty("params") && navigation.state.params !== undefined) return {};
        return {
            headerLeft: (
                <Button onPress={() => {
                    navigation.navigate('View', {ProfileScreen: screenProps.ProfileScreen});
                }} transparent><Icon
                    name="ios-settings"/></Button>
            ),
            headerRight: (
                <Button onPress={screenProps.store.promptForLogout} transparent><Text>{i18n.t('ProfileScreen-SignOut')}</Text></Button>
            )
        }
    };

    constructor(props) {
        super(props);

        this.state = {
            user: null,
            ready: false,
            status: '',
            checked: true,
            location: false,
            showStatusModal: false,
            location_is_allowed: null,
        };
        this.store = this.props.screenProps.store;
        this.props.screenProps.ProfileScreen = this;
    }

    componentDidMount() {
        // Check if there is a user given else print your own profile
        if (this.props.navigation.state.hasOwnProperty('params') && this.props.navigation.state.params !== undefined) {
            let id = this.props.navigation.state.params.id;

            if (id !== undefined) {
                // Try to find the user else print an error
                this.store.getUserInformation(id).then(user => {
                    this.setState({user: user, ready: true}, () => {
                        this.setState({location_is_allowed: user.location_is_allowed});
                    });
                }).catch(error => {
                    this.setState({user: this.store.user, ready: false}, () => {
                        this.setState({location_is_allowed: this.store.user.location_is_allowed});
                    });
                    Alert.alert(i18n.t('ProfileScreen-Error'), i18n.t('ProfileScreen-UserNotFound'));
                });

            } else {
                this.setState({user: this.store.user, ready: true}, () => {
                    this.setState({location_is_allowed: this.store.user.location_is_allowed});
                });
            }
        } else {
            this.setState({user: this.store.user, ready: true}, () => {
                this.setState({location_is_allowed: this.store.user.location_is_allowed});
            });
        }
    };

    updateLocationIsAllowed(){
        this.store.getUserInformation(this.store.user.id).then(user => {
            this.setState({
                location_is_allowed: user.location_is_allowed
            });
        });
    };

    updateStatus = (status) => {
        console.log('neuer status', status);
        this.store.updateAccount(this.state.user, {status: status}).then((result) => {
            if (!Array.isArray(result)) this.setState({user: result});
        }).catch((error) => {
            console.error(error);
            this.toastIt(i18n.t('ProfileScreen-ErrorReload'));
        });
        this.setState({showStatusModal: false});
    };

    toastIt = (text) => {
        Toast.show({
            text: text,
            position: 'top',
            buttonText: 'ok',
            type: 'warning',
            duration: 2000
        })
    };

    goToChat = () => {
        this.store.createChat({
            participants: [this.state.user.id, this.store.user.id],
            type: 'personal'
        }).then((chat) => {
            if (Array.isArray(chat)) chat = chat[0];
            // Chatobjekt aufgelöst holen
            this.store.findChat(chat.id).then(chat => {
                if (Array.isArray(chat)) chat = chat[0];
                this.props.navigation.navigate('Chat', {chat: chat});
            }).catch(error => {
                console.log(error);
                Alert.alert(i18n.t('ProfileScreen-Error'), i18n.t('ProfileScreen-ChatNotFound'), [{
                    text: i18n.t('ProfileScreen-OK'), onPress: () => {
                    }, style
                }]);
            });
        }).catch((error) => {
            console.log(error);
            Alert.alert(i18n.t('ProfileScreen-Error'), i18n.t('ProfileScreen-ChatWith') + ` ${this.state.user.prename} ` + i18n.t('ProfileScreen-NotFound'), [{
                text: i18n.t('ProfileScreen-OK'), onPress: () => {
                }, style: 'destroy'
            }]);
        });
    };

    showModalStatus = () => {
        this.setState({showStatusModal: true})
    };
    hideModalStatus = () => {
        this.setState({showStatusModal: false})
    };

    renderSettings = () => {
        return (
            <View>
                <ModalInput
                    text={i18n.t('ProfileScreen-TypeStatus')}
                    placeholder={i18n.t('ProfileScreen-StatusPoints')}
                    visible={this.state.showStatusModal}
                    input={this.state.status}
                    positiv={this.updateStatus}
                    negativ={this.hideModalStatus}
                    maxLength={99}
                />
                <Button transparent danger onPress={this.showModalStatus}><Text>{i18n.t('ProfileScreen-ChangeStatus')}</Text></Button>
            </View>

        )
    };
    renderUserInformations = () => {
        return (
            <Button transparent danger onPress={this.goToChat}><Text>{i18n.t('ProfileScreen-SendMessage')}</Text></Button>
        )
    };

    renderLocation = () => {
        let time = <Text></Text>;
        let text = <Text></Text>;
        if (this.state.user.location_check_time) {
            time = <TimeAgo time={this.state.user.location_check_time} name={'last_location_time'}/>
        }
        if (this.state.location_is_allowed === false) {
            text = (<Text>{i18n.t('ProfileScreen-LocationNotAllowed')}</Text>);
            console.log('1' + this.state.location_is_allowed);
        } else if (this.state.user.location_in_hs && this.state.location_is_allowed === true) {
            // Set a text for a user who were near hs
            text = (<Text>{i18n.t('ProfileScreen-AtUniversity')}</Text>);
            console.log('2' + this.state.location_is_allowed);
        } else if (!this.state.user.location_in_hs && this.state.location_is_allowed === true) {
            // Set a text for a user who is far away from the hs
            text = (<Text><Distance distance={this.state.user.meter_to_hs}/>{i18n.t('ProfileScreen-DistanceFromUniversity')}</Text>);
            console.log('3' + this.state.location_is_allowed);
        } else {
            // Set default text if the user has not been online yet
            text = (<Text>{i18n.t('ProfileScreen-LocationNotFound')}</Text>);
            console.log('4' + this.state.location_is_allowed);
        }
        return (
            <Item stackedLabel style={[styles.item, styles.left]}>
                <Label>{i18n.t('ProfileScreen-Location')}</Label>
                <Text>{time} {text}</Text>
            </Item>)

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
                <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center',}}>
                    <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center',}}
                          size={1}>
                        <Thumbnail large
                                   source={{uri: 'https://api.adorable.io/avatars/200/' + this.state.user.email + '.png'}}/>
                    </View>
                    <View style={[BaseStyles.transparent, {
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                        marginLeft: 5,
                    }]}>
                        <H3 style={styles.header}>{this.state.user.prename} {this.state.user.lastname}</H3>
                        <Text>{i18n.t('ProfileScreen-LastTimeOnline')}<TimeAgo time={this.state.user.last_time_online}
                                                      name={'last_online'}/></Text>
                    </View>
                </View>
                <Form>
                    {!(this.state.user.status === null || this.state.user.status === '') &&
                    <Item stackedLabel style={[styles.item, styles.left]}>
                        <Label>{i18n.t('ProfileScreen-Status')}</Label>
                        <Text style={styles.left}>{this.state.user.status}</Text>
                    </Item>
                    }
                    {this.renderLocation()}
                    <Item stackedLabel style={[styles.item, styles.left]}>
                        <Label>{i18n.t('ProfileScreen-Mail')}</Label>
                        <Text>{this.state.user.email}</Text>
                    </Item>
                    <Item stackedLabel style={[styles.item, styles.left]}>
                        <Label>{i18n.t('ProfileScreen-ID')}</Label>
                        <Text>{this.state.user.hsid}</Text>
                    </Item>
                </Form>
                <View style={{marginTop: 10}}>
                    {this.state.user.id === this.store.user.id ? this.renderSettings() : this.renderUserInformations()}
                </View>

            </View>
        );
    }
}
