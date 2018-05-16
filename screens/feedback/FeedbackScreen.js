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
import {Icon, Spinner, H1, Form, Textarea, Button, Toast} from 'native-base'
import baseStyles from '../../baseStyles';

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
        this.maxTextInput=2000;
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
            textStyle: {flex: 1, textAlign:'center'},
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
            this.toastIt('Bitte gib etwas mehr Text ein', 'warning');
            return;
        } else if(this.state.loading){
            return;
        }

        //Send it
        this.setState({loading: true});
        let data={
            text: this.state.text,
            createdAt: Date.now(),
        };
        this.store.app.service('feedback').create(data).then(()=>{
            //After
            this.setState({loading: false, text: ''});
            this.toastIt('Danke für dein Feedback', 'success');

        }).catch(error =>{
            this.setState({loading: false});
            this.toastIt('Bei senden ist ein Fehler aufgetretten 😩', 'error');
        });




    };

    renderTextCounter() {

        let color = 'green';
        if (this.state.text.length < 15)
            color= 'orange';
        if (this.state.text.length > this.maxTextInput)
            color= 'red';

            return (
                <View style={{flexDirection:'row', justifyContent:'flex-end'}}>
                    <Text>
                        <Text style={{color: color}}>{this.state.text.length}</Text>/{this.maxTextInput}
                    </Text>
                </View>
            )
    }

    render() {
        let buttonText= <Text>Absenden!</Text>
        if(this.state.loading) buttonText=<Spinner color='green'/>
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <Image style={baseStyles.backgroundImage} source={require('../../assets/img/bg.png')}/>
                <View style={{marginTop: 25, marginLeft: 25, marginRight: 25}}>
                    <View style={{flexDirection: 'row'}}>
                        <View style={{justifyContent: 'center', marginRight: 15}}>

                            <Text style={{fontSize: 30}}>⚒</Text>
                        </View>
                        <View style={{marginRight: 50}}>
                            <View>
                                <H1>
                                    Wir brauchen dich❗
                                </H1>
                                <Text>Dir fehlt etwas oder ist ein Fehler aufgefallen?
                                    Dann sende uns jetzt anonym deine
                                    Verbesserungsvorschläge!</Text>
                                <Text>Wir <Text style={{fontWeight: 'bold'}}>danken</Text> dir 😍</Text>
                            </View>
                        </View>
                    </View>

                    <Form style={{marginTop: 20}}>
                        <View style={{marginBottom: 20}}>
                            <Textarea onChangeText={(text) => this.setState({text: text})} value={this.state.text}
                                      style={{backgroundColor: 'white', marginBottom: 5}} rowSpan={11} bordered
                                      placeholder="Dein Feedback!"/>
                            {this.renderTextCounter()}
                        </View>
                        <Button block success onPress={this.send}>
                            {buttonText}
                        </Button>
                    </Form>
                </View>
            </TouchableWithoutFeedback>
        )

    }
}
