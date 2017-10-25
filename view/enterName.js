import React from 'react';
import { View, Text, StyleSheet  } from 'react-native';
import { Link } from 'react-router-native';
import { FormLabel, FormInput, Button, Icon } from 'react-native-elements'



const styles = StyleSheet.create({

    middle:{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center'
    }

});

export default class EnterName extends React.Component {

    constructor(props) {
        super(props);
        this.state = {text: ''};
    }

    log=(m)=>{
        this.setState({text: m})
    };

    componentWillMount(){
        this.c = new WebSocket('wss://hsc-backend.herokuapp.com/', 'hsc-protocol');
        this.c.onopen=function(){
            console.log('CCCCOOOOONEEECTETETEET')
        };
        this.c.onerror=function () {
            console.log('ERRROOROROROR')
        };
    }


    send=()=>{
        let data={
            type: 'join',
            nickname: this.state.text,
            sent: Date.now()
        };



        this.c.send(JSON.stringify(data));

        this.c.onmessage=function (evt) {
            console.log(evt.data)
        }
    };


    render() {
        return (
            <View style={{flex: 1}}>
                <View style={styles.middle}>
                    <FormLabel>Name</FormLabel>
                    <FormInput onChangeText={this.log} ref={ref => this.formInput = ref}/>
                    <Button
                        title='Enter Chat'
                        onPress={this.send}
                        large={false}
                        rightIcon={{name: 'send', type:'font-awesome', size:20}}
                        backgroundColor='#d80030'
                        containerViewStyle={{marginTop: 10}}
                    />
                </View>
            </View>
        )
    }
}
