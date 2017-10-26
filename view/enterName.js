import React from 'react';
import { View, Text, StyleSheet  } from 'react-native';
import { Link, Redirect } from 'react-router-native';
import { FormLabel, FormInput, Button, Icon } from 'react-native-elements'

import Socket from '../socket';

import LoadingIcon from '../components/loadingtIcon'


const styles = StyleSheet.create({

    middle:{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center'
    },

});

export default class EnterName extends React.Component {

    constructor(props) {
        super(props);
        this.ready=false;
        this.state = {text: '', redirect: false};
    }

    log=(m)=>{
        this.setState({text: m})
    };

    componentWillMount(){
        this.sock = new Socket();
        this.c= this.sock.getConnection();
        this.c.onopen=()=>{
            console.log('opened');
            this.ready=true;
        };
        this.c.onerror= () =>{
            this.ready=false;
        };
        this.c.onclose=()=>{
            console.log('conn closed');
        };
    }


    send=()=>{
        if(!this.ready){this.setState({errorMsg: 'Keine Verbindung zum Server!'});return};
        let data={
            type: 'join',
            nickname: this.state.text,
            sent: Date.now()
        };
        this.sock.setName(this.state.text);
        this.c.send(JSON.stringify(data));

        this.c.onmessage= (evt) =>{
            console.log(evt.data);
            if(data.success===false){
                this.setState({errorMsg: 'Vom Server abgelehnt'})
            }
            this.setState({redirect:true})
        }
    };


    render() {
        if(this.state.redirect){
            return(<Redirect to='/chat' push={true}/>)
        }
        return (
            <View style={{flex: 1}}>
                <View style={styles.middle}>
                    <FormLabel>Name</FormLabel>
                    <LoadingIcon style={{fontSize:100}} loading={this.state.loading}/>
                    <FormInput onChangeText={this.log} ref={ref => this.formInput = ref}/>
                    <Button
                        title={'Zum Chat!'}
                        onPress={this.send}
                        large={false}
                        rightIcon={{name: 'send', type:'font-awesome', size:20}}
                        backgroundColor='#d80030'
                        containerViewStyle={{marginTop: 10}}
                    />
                    <View>
                        <Text style={{color:'#FF0000'}}>{this.state.errorMsg}</Text>
                    </View>
                </View>
            </View>
        )
    }
}
