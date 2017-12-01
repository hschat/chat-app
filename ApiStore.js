import {Alert, AsyncStorage} from 'react-native';
import {observable, action, computed} from 'mobx';
import {autobind} from 'core-decorators';
import io from 'socket.io-client';
import feathers from 'feathers/client'
import hooks from 'feathers-hooks';
import socketio from 'feathers-socketio/client'
import authentication from 'feathers-authentication-client';

const API_URL = process.env['CHAT_ENDPOINT'] || "http://hsc-backend.herokuapp.com";

@autobind
export default class ApiStore {

    @observable isAuthenticated = false;
    @observable isConnecting = false;
    @observable user = null;
    @observable messages = [];
    @observable hasMoreMessages = false;
    @observable skip = 0;

    constructor() {
        console.log('API:', API_URL);
        const options = {transports: ['websocket'], pingTimeout: 3000, pingInterval: 5000};
        const socket = io(API_URL, options);

        this.app = feathers()
            .configure(socketio(socket))
            .configure(hooks())
            .configure(authentication({
                storage: AsyncStorage // To store our accessToken
            }));

        this.connect();

        this.app.service('messages').on('created', createdMessage => {
            this.messages.unshift(this.formatMessage(createdMessage));
        });

        this.app.service('messages').on('removed', removedMessage => {
            this.deleteMessage(removedMessage);
        });

        if (this.app.get('accessToken')) {
            this.isAuthenticated = this.app.get('accessToken') !== null;
        }
    }

    connect() {
        this.isConnecting = true;

        this.app.io.on('connect', () => {
            this.isConnecting = false;

            this.authenticate().then(() => {
                console.log('authenticated after reconnection');
            }).catch(error => {
                console.log('error authenticating after reconnection', error);
            });
        });

        this.app.io.on('disconnect', () => {
            console.log('disconnected');
            this.isConnecting = true;
        });
    }

    createAccount(userData) {
        return this.app.service('users').create(userData).then((result) => {
            return this.authenticate({email: userData.email, password: userData.password, strategy: 'local'})
        });
    }

    updateAccount(user, obj){
        return this.app.service('users').patch(user.id, obj);
    }


    authenticate(options) {
        options = options ? options : undefined;
        return this._authenticate(options).then(user => {
            console.log('authenticated successfully', user.id, user.email);
            this.user = user;
            this.isAuthenticated = true;
            return Promise.resolve(user);
        }).catch(error => {
            console.log('authenticated failed', error.message);
            console.log(error);
            return Promise.reject(error);
        });
    }

    _authenticate(payload) {
        return this.app.authenticate(payload)
            .then(response => {
                return this.app.passport.verifyJWT(response.accessToken);
            })
            .then(payload => {
                return this.app.service('users').get(payload.userId);
            }).catch(e => Promise.reject(e));
    }

    promptForLogout() {
        Alert.alert('Abmelden', 'Willst du dich wirklich abmelden?',
            [
                {
                    text: 'Abbrechen', onPress: () => {
                }, style: 'cancel'
                },
                {text: 'Ja', onPress: this.logout, style: 'destructive'},
            ]
        );
    }

    logout() {
        this.app.logout();
        this.skip = 0;
        this.messages = [];
        this.user = null;
        this.isAuthenticated = false;
    }


    findUser(partial) {
        partial = '^' + partial + '[\s\S]*';
        const query = {
            query: {
                $or: [
                    {
                        email: {
                            $search: partial
                        }
                    },
                    {
                        prename: {
                            $search: partial
                        }
                    },
                    {
                        surname: {
                            $search: partial
                        }
                    },
                    {
                        hsid: {
                            $search: partial
                        }
                    }
                ],
                $ne: {
                    id: this.user.id
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
            console.log(error);
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
            console.error('GET',error);
            return Promise.reject(error)
        })
    }

    loadMessages(loadNextPage) {
        let $skip = this.skip;

        const query = {query: {$sort: {createdAt: -1}, $skip}};

        return this.app.service('messages').find(query).then(response => {
            const messages = [];
            const skip = response.skip + response.limit;

            for (let message of response.data) {
                messages.push(this.formatMessage(message));
            }

            console.log('loaded messages from server', JSON.stringify(messages, null, 2));
            if (!loadNextPage) {
                this.messages = messages;
            } else {
                this.messages = this.messages.concat(messages);
            }
            this.skip = skip;
            this.hasMoreMessages = response.skip + response.limit < response.total;

        }).catch(error => {
            console.log(error);
        });
    }

    formatMessage(message) {
        return {
            _id: message._id,
            text: message.text,
            position: message.user._id.toString() === this.user._id.toString() ? 'left' : 'right',
            createdAt: new Date(message.createdAt),
            user: {
                _id: message.user._id ? message.user._id : '',
                name: message.user.email ? message.user.email : message.name,
                avatar: message.user.avatar ? message.user.avatar : PLACEHOLDER,
            }
        };
    }

    deleteMessage(messageToRemove) {
        let messages = this.messages;
        let idToRemove = messageToRemove.id ? messageToRemove.id : messageToRemove._id;

        messages = messages.filter(function (message) {
            return message.id !== idToRemove;
        });
        this.messages = messages;
    }

    sendMessage(messages = {}, rowID = null) {
        this.app.service('messages').create({text: messages[0].text}).then(result => {
            console.log('message created!');
        }).catch((error) => {
            console.log('ERROR creating message');
            console.log(error);
        });
    }

}
