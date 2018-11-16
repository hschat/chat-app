import React from 'react';
import { TouchableWithoutFeedback, Keyboard, Image } from 'react-native';
import {
  Container, Text, Button, Content,
} from 'native-base';
import i18n from '../../translation/i18n';

const baseStyles = require('../../baseStyles');

export default class LaunchScreen extends React.Component {
  constructor(props) {
    super(props);
    this.store = this.props.screenProps.store;
  }

  render() {
    //die folgende Codezeile muss in die Einstellung übernommen werden, hier lediglich zum Test
    //Wechsel auf Deutsch, wenn nicht angeben ist Englisch die Default-Sprache
    //i18n.changeLanguage('de');
    //Ausgabe Array der verfügbaren Sprachen
    //console.log(i18n.languages);
    //Ausgabe aktuelle Sprache:
    //console.log("Aktuelle ausgewählte Sprache:" + i18n.language);
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
