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
    }
});


export default class ProfileScreen extends Component {

    static navigationOptions = ({navigation, screenProps}) => ({
        headerRight: (<Button onPress={screenProps.store.promptForLogout} transparent><Text>Abmelden</Text></Button>)
    });

    constructor(props) {
        super(props);
        this.state={
            user: null,
            ready: false,
        };
        this.store = this.props.screenProps.store;
        console.log(this.store.user);
        console.log('Params:', this.props.navigation.params);
    }

    componentDidMount() {
        if (this.props.navigation.state.hasOwnProperty('params')) {
            console.log('LOL', this.props.navigation.state.params);
            let id = this.props.navigation.state.params.id;
            if (id !== undefined) {
                this.store.getUserInformation(id).then(user => {
                    this.setState({user: user, ready: true});
                }).catch(error => {
                    this.setState({user: this.store.user, ready: true});
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
            <Text>
                HALLO I BIMS
            </Text>
        )
    };

    render() {
        if(this.state.user===undefined || this.state.user === null)
            return(
                <Spinner color='red' />
            );

        return (
            <Grid style={{padding: 10}}>
                <Image style={ BaseStyles.backgroundImage } source={require('../../assets/img/bg.png')} />
                <Row size={1} style={{marginTop: 15}}>
                    <Col size={1}>
                        <Image style={styles.image} source={{uri: 'http://lorempixel.com/400/400/cats/'}}/>
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