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
    Right
} from "native-base";
import {StyleSheet, Image} from 'react-native';
import {Col, Row, Grid} from 'react-native-easy-grid';
import NavIcons from "../../components/NavIcons";
import {TouchableOpacity} from "react-native";
import TimeAgo from "../../components/TimeAgo";


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
        this.store = this.props.screenProps.store;
        console.log(this.store.user);
    }

    componentWillMount() {
        //this.store.
    }

    renderSettings = () => {
        return (
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'flex-start'}}>
                <View style={{flex: 1, flexDirection: 'row', alignItems: 'flex-start'}}>
                    <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                        <Icon ios='ios-mail-outline' android='ios-mail-outline'/>
                        <Text> {this.store.user.email}</Text>
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


    render() {
        return (
            <Grid style={{padding: 10}}>
                <Row size={1} style={{marginTop: 15}}>
                    <Col size={1}>
                        <Image style={styles.image} source={{uri: 'http://lorempixel.com/400/400/cats/'}}/>
                    </Col>
                    <Col size={2}>
                        <H3 style={styles.header}>{this.store.user.prename} {this.store.user.lastname}</H3>
                        <Text style={styles.subheader}>{this.store.user.hsid}</Text>
                        <TimeAgo time={Date.now()}/>
                    </Col>
                </Row>
                <Row size={3}>
                    {this.renderSettings()}
                </Row>
            </Grid>
        );
    }
}