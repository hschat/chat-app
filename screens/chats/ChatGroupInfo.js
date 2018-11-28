import React, {Component} from 'react';
import {
    View,
    Button,
    Icon,
    Thumbnail,
    Form,
    Item,
    Label,
    Textarea
} from "native-base";
import {StyleSheet, Image, TextInput} from 'react-native';
import BaseStyles from '../../baseStyles';
import i18n from '../../translation/i18n';

const styles = StyleSheet.create({
    image: {
        height: 100,
        borderRadius: 50,
        width: 100,
    },
    left: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    item: {
        borderBottomWidth: 0,
    }
});

export default class ChatGroupInfo extends React.Component {

    constructor(props) {
        super(props);
        this.store = this.props.screenProps.store;
        this.state = {
            id: this.props.navigation.state.params.chat.id,
            name: this.props.navigation.state.params.chat.name,
            description: this.props.navigation.state.params.chat.description,
            userCount: this.props.navigation.state.params.chat.participants.length,
        };
    }

    static navigationOptions = ({navigation, screenProps}) => {
        return {
            headerTitle: i18n.t('ChatGroupInfo-Header'),
            headerLeft: (
                <Button onPress={() => navigation.navigate('Chat')} transparent><Icon
                    name="ios-arrow-back-outline"/></Button>
            )
        }
    };

    updateGroup = (update) => {

        this.setState(update);

        this.store.updateGroup(this.state.id, update    
        ).then(() => {
            console.log('Group updated:', update);
        }).catch((error) => {
            console.error('ChatGroupInfo, error send update', error);
        })
    };

    render() {
        return (
            <View
                style={{flex: 1, padding: 25, paddingTop: 15, justifyContent: 'flex-start', alignItems: 'flex-start'}}>
                <Image style={BaseStyles.backgroundImage} source={require('../../assets/img/bg.png')}/>
                <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center',}}>
                    <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center',}}
                          size={1}>
                        <Thumbnail large
                                   source={require('../../assets/img/group.png')}/>
                    </View>
                    <View style={[BaseStyles.transparent, {
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                        marginLeft: 5,
                    }]}>
                    <TextInput 
                        style={{backgroundColor: 'transparent',
                                fontWeight: 'bold',
                                fontSize: 23,
                                flex: 10}}
                        value={this.state.name}
                        onChangeText={(text) => this.updateGroup({name: text})}
                        multiline={false}
                        underlineColorAndroid='rgba(0,0,0,0)'
                    />
                    </View>
                </View>
                <Form>
                    <Item stackedLabel style={[styles.item, styles.left]}>
                        <Label>
                            {i18n.t('ChatGroupInfo-Describtion')}
                        </Label>
                        <Form style={{marginTop: 20}}>
                            <TextInput 
                                style={{backgroundColor: 'transparent',
                                        borderWidth: 1,
                                        borderRadius: 10,
                                        borderColor: '#000000',
                                        flexDirection: 'row',
                                        alignSelf: 'stretch',
                                        margin: 5}}
                                value={this.state.description}
                                onChangeText={(text) => this.updateGroup({description: text})}
                                multiline={true}
                                underlineColorAndroid='rgba(0,0,0,0)'
                                
                            />
                        </Form>
                    </Item>
                    <Item stackedLabel style={[styles.item, styles.left]}>
                        <Label>{i18n.t('ChatGroupInfo-UserCount')}: {this.state.userCount} </Label>
                    </Item>
                </Form>
            </View>
        );
    }
}
