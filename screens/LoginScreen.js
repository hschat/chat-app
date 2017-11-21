import React from 'react';
import {View, StyleSheet, Image, AsyncStorage} from 'react-native';
import {
  FormInput, Button, Spinner, Container, Title, Icon, Input, Form,
  Text, Item, Label, Toast
} from 'native-base'


const styles = StyleSheet.create({
  middle: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 20
  },
  backgroundImage: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'cover'
  },
  link: {
    fontSize: 15,
    color: '#00335C',
  },
  right:{
    marginTop: 15,
    alignSelf: 'flex-end',
  }
});

export default class LoginScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showToast: false,
    };
  }

  setName = (n) => {
    this.setState({name: n})
  };
  setPassword = (n) => {
    this.setState({password: n});
  };



  render() {
    return (
        <Container>
          <Image source={require('../assets/img/bg.png')} style={styles.backgroundImage}>
            <Form style={styles.middle}>
              <Item floatingLabel last style={{backgroundColor: 'rgb(255,255,255)'}}>
                <Label>E-mail</Label>
                <Input onChangeText={this.setName}
                       ref={ref => this.formInput = ref}
                       bordered
                />
              </Item>
              <Item floatingLabel last style={{backgroundColor: 'rgb(255,255,255)'}}>
                <Label>Passwort</Label>
                <Input onChangeText={this.setPassword}
                       ref={ref => this.formInput = ref}
                       bordered
                />
              </Item>
              <Button onPress={this.send}
                      style={{backgroundColor: '#d80030', marginTop: 10}}
                      underlayColor='#B71234'
                      iconRight
                      full>
                <Text>Beitreten</Text>
                <Icon ios='ios-log-in' android='md-log-in' size={20}/>
              </Button>
            </Form>
          </Image>
        </Container>
      )
  }
}
