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
import {Col, Row, Grid} from 'react-native-easy-grid';
import TimeAgo from '../../components/TimeAgo';
import BaseStyles from '../../baseStyles';
import Location from '../../Location';
import Distance from '../../components/Distance'
import ModalInput from '../../components/ModalWithInput'
//import Switch from 'react-toggle-switch'



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
    left:{
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
            headerRight: (
                <Button onPress={screenProps.store.promptForLogout} transparent><Text>Abmelden</Text></Button>
            )
        }
    };

    constructor(props) {
        super(props);

        this.state = {
            user: null,
            ready: false,
            status: '',
           // switched: false,
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
                    Alert.alert('Fehler', 'Benutzer nicht gefunden');
                });

            } else {
                this.setState({user: this.store.user, ready: true})
            }
        } else {
            this.setState({user: this.store.user, ready: true})
        }
    }

    updateStatus = (status) => {
        console.log('neuer status', status);
        this.store.updateAccount(this.state.user, {status: status}).then((result) => {
            if(!Array.isArray(result)) this.setState({user: result});
        }).catch((error) => {
            console.error(error);
            this.toastIt('Fehler beim Aktualisieren des Status');
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
                Alert.alert('Fehler', `Chat nicht gefunden`, [{
                    text: 'Ok', onPress: () => {
                    }, style
                }]);
            });
        }).catch((error) => {
            console.log(error);
            Alert.alert('Fehler', `Chat mit ${this.state.user.prename} nicht gefunden`, [{
                text: 'Ok', onPress: () => {
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
    /*toggleSwitch = () => {
        this.setState(prevState => {
            return {
                switched: !prevState.switched
            };
        });
    };

    */
    /*toggleChecked = () => {
        this.state.checked= !this.state.checked;
    }*/
    _checkBoxHandler(){
        this.setState({ checked: !this.state.checked});
        this.store.locationEnabled = this.state.checked;
    }

    renderSettings = () => {
        return (
            <View>
                <ModalInput
                    text='Geb deinen neuen Status ein'
                    placeholder='Status...'
                    visible={this.state.showStatusModal}
                    input={this.state.status}
                    positiv={this.updateStatus}
                    negativ={this.hideModalStatus}
                    maxLength={99}
                />
                <Button transparent danger onPress={this.showModalStatus}><Text>Status ändern</Text></Button>
                <Content>
                        <ListItem style={{width: 200}}>
                            <Body>
                            <Text>Standort erlauben?</Text>
                            </Body>
                            <CheckBox
                                checked={this.state.checked}
                                onPress={() => this._checkBoxHandler()}
                            />
                        </ListItem>
                </Content>

            </View>

        )
    };
//<Switch onClick={this.toggleSwitch} on={this.state.switched}/>
/*
<Text style={{paddingLeft: 15}}>Standort erlauben?</Text>
                <CheckBox
                    checked={this.state.checked}
                    onPress={() => this._checkBoxHandler()}
                />
 */
    renderUserInformations = () => {
        return (
            <Button transparent danger onPress={this.goToChat}><Text>Nachricht senden</Text></Button>
        )
    };

    renderLocation = () => {

        let time = <Text></Text>;
        let text = <Text></Text>;
        if(this.state.user.location_check_time){
            time = <TimeAgo time={this.state.user.location_check_time} name={'last_location_time'}/>
        }
        if (this.state.user.location_in_hs) {
            // Set a text for a user who were near hs
            text = <Text>An der Hochschule</Text>;
        } else if (!this.state.user.location_in_hs && this.state.user.meter_to_hs !== 123) {
            // Set a text for a user who is far away from the hs
            text = <Text><Distance distance={this.state.user.meter_to_hs}/> von der HS entferent</Text>
        }else if(this.state.user.meter_to_hs === 123){
            text = (<Text>Standort deaktiviert!</Text>)
        }else{
                // Set default text if the user has not been online yet
                text= (<Text>Standort unbekannt!</Text>)
        }
        return (
            <Item stackedLabel style={[styles.item, styles.left]}>
                <Label>Standort</Label>
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
                        <Text>zuletzt online <TimeAgo time={this.state.user.last_time_online}
                                                      name={'last_online'}/></Text>
                    </View>
                </View>
                <Form>
                    {!(this.state.user.status === null || this.state.user.status === '') &&
                    <Item stackedLabel style={[styles.item, styles.left]}>
                        <Label>Status</Label>
                        <Text style={styles.left}>{this.state.user.status}</Text>
                    </Item>
                    }
                    {this.renderLocation()}
                    <Item stackedLabel style={[styles.item, styles.left]}>
                        <Label>E-Mail</Label>
                        <Text >{this.state.user.email}</Text>
                    </Item>
                    <Item stackedLabel style={[styles.item, styles.left]}>
                        <Label>Kürzel</Label>
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
