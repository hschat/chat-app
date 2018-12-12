import React, {Component} from 'react';
import {
    View,
    Button,
    Icon,
    Thumbnail,
    Form,
    Item,
    Label,
} from "native-base";
import {StyleSheet, Image, ScrollView} from 'react-native';
import BaseStyles from '../../baseStyles';
import i18n from '../../translation/i18n';
import ChatGroupHead from '../../components/ChatGroupHead';
import ChatGroupInformation from '../../components/ChatGroupInformation';
import ChatGroupSelfManaged from '../../components/ChatGroupSelfManaged';
import ChatGroupMemberList from '../../components/ChatGroupMemberList';

const styles = StyleSheet.create({
    image: {
        height: 100,
        borderRadius: 50,
        width: 100,
    },
    header: {
        fontWeight: 'bold'
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
            editable : true,
        }
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
            <View style={{flex: 1, paddingLeft: 25, paddingTop: 15, justifyContent: 'flex-start', alignItems: 'flex-start'}}>
                <Image style={BaseStyles.backgroundImage} source={require('../../assets/img/bg.png')}/>
                <ChatGroupHead
                    chat={this.props.navigation.state.params.chat}
                    store={this.props.screenProps.store}
                    editable={this.state.editable}
                />
                <ScrollView style={{width: '100%'}}>
                    <View>
                        <Form>
                            <ChatGroupInformation
                                chat={this.props.navigation.state.params.chat}
                                store={this.props.screenProps.store}
                                editable={this.state.editable}
                            />
                            <ChatGroupMemberList
                                chat={this.props.navigation.state.params.chat}
                                store={this.props.screenProps.store}
                                editable={this.state.editable}
                                navigation={this.props.navigation}
                            />
                            <ChatGroupSelfManaged
                                chat={this.props.navigation.state.params.chat}
                                store={this.props.screenProps.store}
                                editable={this.state.editable}
                            />
                        </Form>
                    </View>
                </ScrollView>
                
            </View>
        );
    }
}
