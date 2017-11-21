import React, {Component} from 'react';
import {Text, View, Button} from "native-base";
import NavIcons from "../../components/NavIcons";
import {TouchableOpacity} from "react-native";

export default class ProfileScreen extends Component {

    static navigationOptions = ({navigation, screenProps}) => ({
        headerRight:(<Button onPress={screenProps.store.promptForLogout} transparent><Text>Abmelden</Text></Button>)
    });

    constructor(props) {
        super(props);
        this.store = this.props.screenProps.store;
    }

    render() {
        return (
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <Text>ProfileScreen</Text>
            </View>
        );
    }
}