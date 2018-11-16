import React from 'react';
import { TouchableWithoutFeedback, Keyboard, Image, AsyncStorage } from 'react-native';
import {
  Container, Text, Button, Content,
} from 'native-base';
import i18n from '../../translation/i18n';

const baseStyles = require('../../baseStyles');

export default class LaunchScreen extends React.Component {
  constructor(props) {
    super(props);
    this.store = this.props.screenProps.store;
    this.state = {
      language : ' ',
    };
  }

  componentDidMount = () => AsyncStorage.getItem('currLang')
                              .then((value) => this.setState({ 'language': value }));
  
  render() {
   if(this.state.language === null || this.state.language === 'null'){
     AsyncStorage.setItem('currLang',i18n.language);
    }else if(this.state.language !== ' ' && this.state.language !== null && this.state.language !== 'null'){
    i18n.changeLanguage(this.state.language);
   }
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container>
          <Image style={baseStyles.backgroundImage} source={require('../../assets/img/bg.png')} />
          <Content contentContainerStyle={baseStyles.middle}>
            <Button style={baseStyles.redButton} block onPress={() => this.props.navigation.navigate('Signup')}>
              <Text style={baseStyles.redButtonText}>{i18n.t('LaunchScreen-SignUp')}</Text>
            </Button>
            <Button style={baseStyles.redButton} block onPress={() => this.props.navigation.navigate('Login')}>
              <Text style={baseStyles.redButtonText}>{i18n.t('LaunchScreen-SignIn')}</Text>
            </Button>
          </Content>
        </Container>
      </TouchableWithoutFeedback>
    );
  }
}
