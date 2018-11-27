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
import {StyleSheet, Image} from 'react-native';
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
                      <Textarea style={{backgroundColor: 'transparent', fontWeight: 'bold', fontSize: 23}}
                                      placeholder={this.props.navigation.state.params.chat.name}/>
                    </View>
                </View>
                <Form>
                    <Item stackedLabel style={[styles.item, styles.left]}>
                        <Label>
                            {i18n.t('ChatGroupInfo-Describtion')}
                        </Label>
                        <Form style={{marginTop: 20}}>
                            <Textarea style={{backgroundColor: 'transparent'}} rowSpan={2}
                                      placeholder="Hier steht die Beschreibung"/>
                        </Form>
                    </Item>
                    <Item stackedLabel style={[styles.item, styles.left]}>
                        <Label>{i18n.t('ChatGroupInfo-UserCount')}: {this.props.navigation.state.params.chat.participants.length} </Label>
                    </Item>
                </Form>
            </View>
        );
    }
}