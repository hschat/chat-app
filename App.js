import React, {Component} from 'react';
import {Root, View, Text} from 'native-base';
import DropdownAlert from 'react-native-dropdownalert';


import ApiStore from "./ApiStore";
import MainNavigator from "./components/MainNavigator";
import UnauthenticatedNavigator from "./components/LaunchNavigator";
import {autobind} from "core-decorators";
import {observer} from "mobx-react";
import {observe} from "mobx";

@autobind @observer
export default class App extends Component {

    constructor(props) {
        super(props);
        this.store = new ApiStore();
        observe(this.store, "alert", this.showAlert, true);
    }

    async componentWillMount() {
        await Expo.Font.loadAsync({
            'Roboto': require('native-base/Fonts/Roboto.ttf'),
            'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
        });
    }


    showAlert = () => {
        if (Object.keys(this.store.alert).length === 0) return;
        this.dropdown.alertWithType(this.store.alert.type, this.store.alert.title, this.store.alert.msg);
        this.store.alert = {};
    };

    onClose(data) {
        if (data.action === 'pan') {
            // navigate to chat with the user
        }
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <DropdownAlert
                    ref={ref => this.dropdown = ref}
                    onClose={data => this.onClose(data)}
                    zIndex={10}
                />
                <Root>
                    {
                        this.store.isAuthenticated ? <MainNavigator screenProps={{store: this.store}}/> :
                            <UnauthenticatedNavigator screenProps={{store: this.store}}/>
                    }
                </Root>
            </View>
        );
    }
}


