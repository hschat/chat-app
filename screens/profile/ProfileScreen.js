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
    List,
    Body,
    Left,
    Right,
    Spinner
} from "native-base";
import {StyleSheet, Image, Alert, Dimensions} from 'react-native';
import {Col, Row, Grid} from 'react-native-easy-grid';
import TimeAgo from '../../components/TimeAgo';
import BaseStyles from '../../baseStyles';


const styles = StyleSheet.create({
    image: {
        height: 100,
        borderRadius: 50,
        width: 100
    },
    header: {
        fontWeight: 'bold'
    },
    subheader: {
        color: '#999999'
    },
    middle: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    roundedIcon: {
        backgroundColor: '#ff3232',
        padding: 10,
        borderRadius: 100,
        width: 47,
        height: 47,
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


    renderSettings = () => {
        return (
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'flex-start'}}>
                <View style={{flex: 1, flexDirection: 'row', alignItems: 'flex-start'}}>
                    <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                        <Icon ios='ios-mail-outline' android='ios-mail-outline'/>
                        <Text> {this.state.user.email}</Text>
                    </View>
                </View>
                <View>
                    <Form style={{flex: 1, flexDirection: 'row', alignItems: 'flex-start'}}>
                        <Item floatingLabel>
                            <Label>Status ändern</Label>
                            <Input/>
                        </Item>
                    </Form>
                </View>
            </View>
        )
    };

    renderUserInformations = () => {
        return (
            <Grid style={{backgroundColor: 'rgba(0,0,0,0)',}}>
                <Row size={1}>
                    <Col>
                    </Col>
                    <Col>
                        <View style={styles.roundedIcon}>
                            <Icon color='#FFFFFF' name='ios-chatboxes-outline'/>
                        </View>
                    </Col>
                    <Col>
                        <View style={styles.roundedIcon}>
                            <Icon name='ios-chatboxes-outline'/>
                        </View>
                    </Col>
                    <Col>
                        <View style={styles.roundedIcon}>
                            <Icon name='ios-chatboxes-outline'/>
                        </View>
                    </Col>
                    <Col></Col>
                </Row>
                <Row size={4}>
                    <View>
                        <View style={{flex: 1, flexDirection: 'row', alignItems: 'flex-start'}}>
                            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                                <Icon ios='ios-mail-outline' android='ios-mail-outline'/>
                                <Text> {this.state.user.email}</Text>
                            </View>
                        </View>
                    </View>
                </Row>
            </Grid>
        )
    };

    render() {
        if (this.state.user === undefined || this.state.user === null)
            return (
                <Spinner style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center',}}
                         color='red'/>
            );

    return (
      <Grid style={{padding: 10}}>
        <Image style={BaseStyles.backgroundImage} source={require('../../assets/img/bg.png')}/>
        <Row size={1} style={{marginTop: 15}}>
          <Col size={1}>
            <Image style={styles.image} source={{uri: 'https://api.adorable.io/avatars/200/' + this.state.user.email + '.png'}}/>
          </Col>
          <Col size={2}>
            <H3 style={styles.header}>{this.state.user.prename} {this.state.user.lastname}</H3>
            <Text style={styles.subheader}>{this.state.user.hsid}</Text>
            <TimeAgo time={Date.now()}/>
          </Col>
        </Row>
        <Row size={3}>
          {this.state.user.id === this.store.user.id ? this.renderSettings() : this.renderUserInformations()}
        </Row>
      </Grid>
    );
  }
}