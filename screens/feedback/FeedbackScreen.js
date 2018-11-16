import React from 'react';
import {
    KeyboardAvoidingView,
    TextInput,
    StyleSheet,
    View,
    AsyncStorage,
    Text,
    Image,
    Alert,
    Keyboard,
    TouchableWithoutFeedback
} from 'react-native';
import {Content, Icon, Spinner, H1, Form, Textarea, Button, Toast} from 'native-base'
import baseStyles from '../../baseStyles';
import i18n from '../../translation/i18n';

const styles = StyleSheet.create({
    middle: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
});

export default class FeedbackScreen extends React.Component {
    static navigationOptions = ({navigation, screenProps}) => {
        const params = navigation.state.params || {};

        return {
            title: 'Feedback',
        };
    };

    constructor(props) {
        super(props);
        this.store = this.props.screenProps.store;
        this.maxTextInput = 2000;
        this.state = {
            text: '',
            loading: false
        };
    }

    componentWillMount() {

    }

    componentDidMount() {

    }

    toastIt = (text, type) => {
        Toast.show({
            text: text,
            position: 'top',
            textStyle: {flex: 1, textAlign: 'center'},
            type: type,
            duration: 2000
        })
    };

    /**
     * Saves the Feedback
     */
    send = () => {
        // Check if this is to short
        if (this.state.text.length < 15) {
            this.toastIt(i18n.t('FeedbackScreen-MoreText'), 'warning');
            return;
        } else if (this.state.loading) {
            return;
        }

        //Send it
        this.setState({loading: true});
        let data = {
            text: this.state.text,
            createdAt: Date.now(),
        };
        this.store.app.service('feedback').create(data).then(() => {
            //After
            this.setState({loading: false, text: ''});
            this.toastIt(i18n.t('FeedbackScreen-ThankYou'), 'success');

        }).catch(error => {
            this.setState({loading: false});
            this.toastIt(i18n.t('FeedbackScreen-ErrorSending'), 'error');
        });


    };

    renderTextCounter() {
        let color = 'green';
        if (this.state.text.length < 15)
            color = 'orange';
        if (this.state.text.length > this.maxTextInput)
            color = 'red';

        return (
            <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                <Text>
                    <Text style={{color: color}}>{this.state.text.length}</Text>/{this.maxTextInput}
                </Text>
            </View>
        )
    }

    render() {
        let buttonText = <Text>{i18n.t('FeedbackScreen-Send')}</Text>
        if (this.state.loading) buttonText = <Spinner color='green'/>
        return (
            <Content>
                <Image style={baseStyles.backgroundImage} source={require('../../assets/img/bg.png')}/>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={{marginTop: 25, marginLeft: 25, marginRight: 25}}>
                        <View style={{flexDirection: 'row'}}>
                            <View style={{justifyContent: 'center', marginRight: 15}}>

                                <Text style={{fontSize: 30}}>⚒</Text>
                            </View>
                            <View style={{marginRight: 50}}>
                                <View>
                                    <H1>
                                    {i18n.t('FeedbackScreen-WeNeedHelp')}
                                    </H1>
                                    <Text>{i18n.t('FeedbackScreen-WeNeedHelpMsg')}</Text>
                                    <Text>{i18n.t('FeedbackScreen-HelpThankYou1')}<Text style={{fontWeight: 'bold'}}>{i18n.t('FeedbackScreen-HelpThankYou2')}</Text>{i18n.t('FeedbackScreen-HelpThankYou3')}</Text>
                                </View>
                            </View>
                        </View>

                        <Form style={{marginTop: 20}}>
                            <View style={{marginBottom: 20}}>
                            <Textarea onChangeText={(text) => this.setState({text: text})} value={this.state.text}
                                      style={{backgroundColor: 'white', marginBottom: 5}} rowSpan={11} bordered
                                      placeholder={i18n.t('FeedbackScreen-YourFeedback')}/>
                                {this.renderTextCounter()}
                            </View>
                            <Button block success onPress={this.send}>
                                {buttonText}
                            </Button>
                        </Form>
                    </View>
                </TouchableWithoutFeedback>
            </Content>
        )

    }
}
