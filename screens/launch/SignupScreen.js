import React from 'react';
import {StyleSheet, Image, TouchableWithoutFeedback, Keyboard, Alert} from 'react-native';
import {
  FormInput, Button, Spinner, Container, Title, Icon, Input, Form,
  Text, Item, Label, Toast, Content
} from 'native-base'
import {observable, action, computed} from 'mobx';
import i18n from '../../translation/i18n'

const baseStyles = require('../../baseStyles');

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'cover'
  },
  middle: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 20,
    paddingTop: 0,
  },
  form: {
    marginTop: 20,
  }
});

export default class SignupScreen extends React.Component {

  @observable loading = false;

  constructor(props) {
    super(props);
    this.store = this.props.screenProps.store;
    this.state = {
      showToast: false,
      prename: '',
      lastname: '',
      identifier: '',
      email: '',
      password: '',
      passwordRepeat: '',
      errorPrename: false,
      errorLastname: false,
      errorIdentifier: false,
      errorEmail: false,
      errorPassword: false,
      errorPasswordRepeat: false,
    };

  }

  // Input field setter
  setPreName = (n) => {
    this.setState({prename: n});
  };
  setLastName = (n) => {
    this.setState({lastname: n});
  };
  setIdentifier = (n) => {
    this.setState({identifier: n});
  };
  setEmai = (n) => {
    this.setState({email: n});
  };
  setPassword = (n) => {
    this.setState({password: n});
  };
  setPasswordRepeat = (n) => {
    this.setState({passwordRepeat: n});
  };


  toastIt = (text) => {
    Toast.show({
      text: text,
      position: 'top',
      buttonText: 'ok',
      type: 'warning',
      duration: 2000
    })
  };

  check = (name) => {
    switch (name) {
      case 'prename':
        if (!this.validate('nullOrEmpty', this.state.prename)) {
          this.setState({errorPrename: true});
          this.toastIt(i18n.t('SignupScreen-ErrorPrename'));
        } else {
          this.setState({errorPrename: false});
        }
        break;
      case 'lastname':
        if (!this.validate('nullOrEmpty', this.state.lastname)) {
          this.setState({errorLastname: true});
          this.toastIt(i18n.t('SignupScreen-ErrorLastname'));
        } else {
          this.setState({errorLastname: false});
        }
        break;
      case 'identifier':
        if (!this.validate('identifierCheck', this.state.identifier, this.state.prename, this.state.lastname)) {
          this.setState({errorIdentifier: true});
          this.toastIt(i18n.t('SignupScreen-ErrorIdentifier'));
        } else {
          this.setState({errorIdentifier: false});
        }
        break;
        if (!this.validate('nullOrEmpty', this.state.identifier)) {
          this.setState({errorIdentifier: true});
          this.toastIt(i18n.t('SignupScreen-ErrorIdentifierCheck'));
        } else {
          this.setState({errorIdentifier: false});
        }
        break;
      case 'email':
        if (!this.validate('nullOrEmpty', this.state.email)) {
          this.setState({errorEmail: true});
          this.toastIt(i18n.t('SignupScreen-ErrorEmailCheck'));
        } else if(!this.validate('isHSMail', this.state.email)) {
          this.setState({errorEmail: true});
          this.toastIt(i18n.t('SignupScreen-ErrorEmail'));
        } else {
          this.setState({errorEmail: false});
        }
        break;
      case 'password':
        if (!this.validate('nullOrEmpty', this.state.password)) {
          this.setState({errorPassword: true});
          this.toastIt(i18n.t('SignupScreen-ErrorPassword'));
        } else {
          this.setState({errorPassword: false});
        }
        if (!this.validate('password', this.state.password)) {
          this.setState({errorPassword: true});
          this.toastIt(i18n.t('SignupScreen-ErrorPasswordLength'));
        } else {
          this.setState({errorPassword: false});
        }
        break;
      case 'passwordRepeat':
        if (!this.validate('passwordRepeat', this.state.password, this.state.passwordRepeat)) {
          this.setState({errorPasswordRepeat: true});
          this.toastIt(i18n.t('SignupScreen-ErrorPasswordRepeat'));
        } else {
          this.setState({errorPasswordRepeat: false});
        }
        break;
    }
  };

  /**
   * Checks input fields
   * @param type  password= checks for password guidelines (p1)
   *              passwordCheck= cheacks if passwords are equal
   *              nullOrEmpty= check if p1 is null or ''
   *              nullOrEmpty2= check if p1 or p2 is null or ''
   *              identifierCheck= p1 identifer p2 prename p3 lastname
   * @param p1    value you check
   * @param p2    only needed for password
   * @return      boolean if check was successfull = true else false
   */
  validate = (type, p1 = null, p2 = null, p3 = null) => {

    switch (type) {
      case 'password':
        if (p1.length < 8) return false;
        break;
      case 'passwordRepeat':
        if (p1 !== p2) return false;
        break;
      case 'nullOrEmpty':
        if (p1 === null || p1 === '') return false;
        break;
      case 'nullOrEmpty2':
        if (p1 === null || p2 === null || p1 === '' || p2 === '') return false;
        break;
      case 'identifierCheck':
        p1 = p1.toLowerCase();
        p2 = p2.toLowerCase();
        p3 = p3.toLowerCase();
        if ((!(p1.charAt(0) === p3.charAt(0)) || !(p1.charAt(1) === p3.charAt(1)) ||
          !(p1.charAt(2) === p2.charAt(0)) || !(p1.charAt(3) === p2.charAt(1)) || !(/\w\w\w\w\d\d\d\d/.test(p1) ))
          && !(/\w\w\w\d\d\d\d\w/.test(p1) )  ) return false;
        break;
      case 'isHSMail':
        let c_at = p1.lastIndexOf('@');
        if (c_at === -1) {
          return false;
        } else {
          let domain = p1.slice(c_at+1);
          return domain.match(/(stud\.)?hs-coburg.de/g) !== null;
        }
    }
    return true;
  };

  register = () => {

    if (this.state.errorPrename || this.state.errorLastname || this.state.errorIdentifier || this.state.errorEmail
      || this.state.errorPassword || this.state.errorPasswordRepeat) {
      Alert.alert(i18n.t('SignupScreen-Error'), i18n.t('SignupScreen-ErrorFillAllField'));
      return null;
    }

    this.loading = true;
    let t = this.state;
    this.store.createAccount({
      prename: t.prename,
      lastname: t.lastname,
      hsid: t.identifier,
      email: t.email,
      password: t.password
    }).catch(error => {
      console.error(error);
      Alert.alert(i18n.t('SignupScreen-Error'), i18n.t('SignupScreen-ErrorRegistration'));
      this.loading = false;
    });
  };

  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container>
          <Image style={baseStyles.backgroundImage} source={require('../../assets/img/bg.png')}/>
          <Content>
            <Form style={[styles.form, styles.middle]}>
              <Item stackedLabel error={this.state.errorPrename}>
                <Label>{i18n.t('SignupScreen-Prename')}</Label>
                <Input onChangeText={this.setPreName} onBlur={() => this.check('prename')} returnKeyType='next' autoCapitalize='words' onSubmitEditing={Keyboard.dismiss}/>
              </Item>
              <Item stackedLabel error={this.state.errorLastname}>
                <Label>{i18n.t('SignupScreen-Lastname')}</Label>
                <Input onChangeText={this.setLastName} onBlur={() => this.check('lastname')} returnKeyType='next' autoCapitalize='words' onSubmitEditing={Keyboard.dismiss}/>
              </Item>
              <Item stackedLabel error={this.state.errorIdentifier}>
                <Label>{i18n.t('SignupScreen-Identifier')}</Label>
                <Input onChangeText={this.setIdentifier} onBlur={() => this.check('identifier')} returnKeyType='next' autoCapitalize='none' onSubmitEditing={Keyboard.dismiss}/>
              </Item>
              <Item stackedLabel error={this.state.errorEmail}>
                <Label>{i18n.t('SignupScreen-Email')}</Label>
                <Input onChangeText={this.setEmai} onBlur={() => this.check('email')} keyboardType='email-address' returnKeyType='next' autoCapitalize='none' onSubmitEditing={Keyboard.dismiss}/>
              </Item>
              <Item stackedLabel error={this.state.errorPassword}>
                <Label>{i18n.t('SignupScreen-Password')}</Label>
                <Input secureTextEntry={true} onChangeText={this.setPassword} onBlur={() => this.check('password')} returnKeyType='next' autoCapitalize='none' onSubmitEditing={Keyboard.dismiss}/>
              </Item>
              <Item stackedLabel last error={this.state.errorPasswordRepeat}>
                <Label>{i18n.t('SignupScreen-PasswordRepeat')}</Label>
                <Input secureTextEntry={true} onChangeText={this.setPasswordRepeat}
                       onBlur={() => this.check('passwordRepeat')} returnKeyType='done' autoCapitalize='none' onSubmitEditing={Keyboard.dismiss}/>
              </Item>
              <Button onPress={this.register}
                      style={baseStyles.redButton}
                      underlayColor='#B71234'
                      iconRight block>

                <Text style={baseStyles.redButtonText}>{i18n.t('SignupScreen-CreateAccount')}</Text>
                <Icon ios='ios-person-add' android='md-person-add' size={20}/>
              </Button>
            </Form>
          </Content>
        </Container>
      </TouchableWithoutFeedback>
    )
  }
}
