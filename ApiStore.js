import {Alert, AsyncStorage} from 'react-native';
import {observable, action, computed} from 'mobx';
import {autobind} from 'core-decorators';
import io from 'socket.io-client';
import feathers from '@feathersjs/feathers'
import hooks from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio-client'
import authentication from '@feathersjs/authentication-client';
import Location from './Location'
import React, {Component} from 'react'
import {AppState, Text} from 'react-native'
import i18n from './translation/i18n';


const API_URL = process.env['CHAT_ENDPOINT'] || "https://hsc-backend-staging.herokuapp.com";

@autobind
export default class ApiStore {

    @observable isAuthenticated = false;
    @observable isConnecting = false;
    @observable user = null;
    @observable skip = 0;
    @observable alert = {};
    @observable location_is_allowed = true;

    constructor() {
        console.info('API:', API_URL);
        const options = {transports: ['websocket'], pingTimeout: 3000, pingInterval: 5000};
        const socket = io(API_URL, options);
        this.app = feathers()
            .configure(socketio(socket))
            .configure(authentication({
                storage: AsyncStorage // To store our accessToken
            }));
        this.location = new Location();
        this.connect();

        // For recieving new messages
        this.app.service('messages').on('created', createdMessage => {
            if (!createdMessage.system && createdMessage.sender.id !== this.user.id) {
                // Only notify people not created this msg
                this.alert = {
                    type: 'info',
                    title: createdMessage.sender.prename + ' ' + createdMessage.sender.lastname,
                    msg: createdMessage.text,
                    chat_id: createdMessage.chat_id
                };
            } else {
                //Update the msg is delivered to the Server
                this.updateMessage(createdMessage, {recieve_date: Date.now()});
            }

        });

        this.app.service('chats').on('created', chat => {
           console.log('Meine nerven, NEUER CHATTTTTTTT', chat);
        });

        if (this.app.get('accessToken')) {
            this.isAuthenticated = this.app.get('accessToken') !== null;
        }

        // To handle background / foreground / close events
        AppState.addEventListener('change', state => {
            if (state === 'active') {
                this.setOnline();
            } else if (state === 'background') {
                this.setOffline();
            } else if (state === 'inactive') { 
                // inactive is only used in iOs, not Android
                this.setOffline();
            }
          });
    }

    connect() {
        this.isConnecting = true;

        this.app.io.on('connect', () => {
            this.isConnecting = false;

            this.authenticate().then(() => {
                console.debug('authenticated after reconnection');
            }).catch(error => {
                console.log('error authenticating after reconnection', error);
            });
        });

        this.app.io.on('disconnect', () => {
            console.info('disconnected');
            this.isConnecting = true;
        });

    }

    createAccount(userData) {
        return this.app.service('users').create(userData).then((result) => {
            return this.authenticate({email: userData.email, password: userData.password, strategy: 'local'})
        });
    }

    setOnline() {
        if(this.user) {
            this.updateAccount(this.user, {last_time_online: Date.now(), isOnline: true});
        } 
        
    } 

    setOffline() {
        if(this.user) {
            this.updateAccount(this.user, {last_time_online: Date.now(), isOnline: false});
        } 
    } 

    updateAccount(user, obj) {
        return this.app.service('users').patch(user.id, obj);
    }

    updateAccountPlus(user, obj){
        this.user = user;
        return this.app.service('users').patch(user.id, obj);
    }

    authenticate(options) {
        options = options ? options : undefined;
        return this._authenticate(options).then(user => {
            console.info('authenticated successfully', user.id, user.email);
            this.user = user;
            this.isAuthenticated = true;
            // Set last time Online and online
            this.setOnline();
            //Update location
            return this.updateUserStatus()
            //return Promise.resolve(user);
        }).catch(error => {
            console.log('authenticated failed', error.message);
            return Promise.reject(error);
        });
    }

    _authenticate(payload) {
        return this.app.authenticate(payload)
            .then(response => {
                return this.app.passport.verifyJWT(response.accessToken);
            })
            .then(payload => {
              console.log(`AUTH:!! ${payload.userId}`)
                return this.app.service('users').get(payload.userId);
            }).catch(e => Promise.reject(e));
    }

    promptForLogout() {
        Alert.alert(i18n.t('ApiStore-SignOut'), i18n.t('ApiStore-SignOutMsg'),
            [
                {
                    text: i18n.t('ApiStore-Cancel'), onPress: () => {
                }, style: 'cancel'
                },
                {text: i18n.t('ApiStore-Yes'), onPress: this.logout, style: 'destructive'},
            ]
        );
    }

    logout() {
        // Set last time Online and online
        this.setOffline();
        this.app.logout();
        this.skip = 0;
        this.messages = [];
        this.user = null;
        this.isAuthenticated = false;
    }

    updateUserStatus = () =>{
        if(!this.location_is_allowed){
            this.updateAccount(this.user,{location_check_time: null, location_in_hs: false, meter_to_hs: 123}).then(user=>{
                return Promise.resolve(user);
            })
        }
        return this.location.getOnHS().then((loc) =>{
            return this.updateAccount(this.user, {location_check_time: Date.now(), location_in_hs: loc.on_hs, meter_to_hs: loc.distance}).then(user=>{
                return Promise.resolve(user);
            });
        });
    };

    findChat(chat_id) {
        return this.app.service('chats').find({query: {id: chat_id}});
    }

    findUser(partial) {
        partial = `${partial}%`;
        const query = {
            query: {
                $or: [
                    {
                        email: {
                            $iLike: partial
                        }
                    },
                    {
                        prename: {
                            $iLike: partial
                        }
                    },
                    {
                        lastname: {
                            $iLike: partial
                        }
                    },
                    {
                        hsid: {
                            $iLike: partial
                        }
                    }
                ],
                id: {
                  $ne: this.user.id
                }
            }
        };


        return this.app.service('users').find(query).then(response => {
            const users = [];
            for (let user in response.data) {
                users.push(response.data[user]);
            }
            return Promise.resolve(users);
        }).catch(error => {
            console.error('Find User error: ', error);
            return Promise.reject(error);
        });
    }

    /**
     * Returns the a user from the given id
     * @param id of the user you want to find
     * @return {Promise.<user>}
     */
    getUserInformation(id) {

        return this.app.service('users').get(id).then(user => {
            return Promise.resolve(user)
        }).catch(error => {
            console.log('GET user', error);
            return Promise.reject(error)
        })
    }

    /**
     * Creates a new chat for for the Person
     * createChat({
     *  owner: this.state.user.id,
     *  recievers: [this.state.res.id]
     * })
     *
     * @param chatData the data for the new Chat
     */
    createChat(chatData) {
        let template = {
            type: undefined,
            name: undefined,
            updatedAt: Date.now(),
        };

        let data = Object.assign(template, chatData);
        return this.app.service('chats').create(data).then((chat) => {
            return chat;
        });
    }

    getChats(user) {
        return this.app.service('chats').find({
            query: {
                $sort: {updatedAt: 1},
            }
        }).then((chats) => {
            return new Promise.resolve(chats);
        }).catch(e =>{
            console.error('ApiStore/getChats', e)
        });
    }


    static formatMessage(message) {
        console.log('APIStore/formatMessage', message)
        return {
            _id: message.id,
            text: message.text,
            createdAt: message.send_date,
            system: message.system === undefined ? false : message.system,
            user:  message.system ? undefined : {
                _id: message.sender.id,
                name: message.sender.email,
                avatar: 'https://api.adorable.io/avatars/200/' + message.sender.email,
            }
        };
    }

    /**
     * sends a new message
     * sendMessage({
     *  text: this.state.text,
     *  sender_id: this.store.user.id,
     *  chat_id: this.state.chat.id
     * })
     *
     * @param message the data for the new Chat
     */
    sendMessage(message) {
        let template = {
            text: undefined,
            sender_id: undefined,
            chat_id: undefined,
            send_date: Date.now(),
            recieve_date: undefined,
            read_date: undefined,
            system: false,
        };
        let data = Object.assign(template, message);
        this.updateUserStatus();
        return this.app.service('messages').create(data);
    }

    sendTyping(message) {
        let template = {
            sender_id: undefined,
            chat_id: undefined,
            send_date: Date.now(),
        };
        let data = Object.assign(template, message);

        console.log('Will emit typing event', data);   
        return this.app.service('typing').create(data);
    }

    getMessagesForChat(chat) {
        return this.app.service('messages').find({query: {chat_id: chat.id, $sort: {send_date: -1}}}).then((msgs) => {
            let m=msgs;
            for (let i in m) {
                console.log('APISTORE/getMessagesForChat', m[i]);
                m[i] = ApiStore.formatMessage(m[i]);
            }
            return m;
        });
    }

    getUsersForChat(chat) {
        return this.app.service('chats').find({
            query: {
                id: chat.id,
                $select: [ 'participants' ]
            }
        });
        /*.then((participants) => {
            return new Promise.resolve(participants);
        }).catch(e => {
            console.error('ApiStore/getUsersForChat', e)
        });*/

    } 

    getLastMessageForChat(chat) {
        return this.app.service('messages').find({
            query: {
                chat_id: chat.id,
                $limit: 2,
                $sort: {
                    send_date: -1
                }
            }
        }).then((msgs) => {
            return Promise.resolve(msgs[0]);
        });
    }

    updateMessage(msg, obj) {
        return this.app.service('messages').patch(msg.id, obj);
    }

}
