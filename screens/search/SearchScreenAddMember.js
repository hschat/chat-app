import React, {Component} from 'react';
import {Alert, Keyboard, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import {
    Body, Button, Container, Content, Header, Icon, Input, Item, Left, Right, List, ListItem, Spinner, Text, Thumbnail,
    View, Badge, InputGroup
} from "native-base";

import DropdownAlert from 'react-native-dropdownalert';
import i18n from '../../translation/i18n';

import ModalInput from '../../components/ModalWithInput';


const styles = StyleSheet.create({

    addedUserBox: {
        backgroundColor: '#F1F1F1',
        minHeight: 40,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    addedUserButton:{
        marginLeft: 5,
        marginRight:5,
    }


});

export default class AddUserToChat extends Component {
    static navigationOptions = ({navigation, screenProps}) => {
        const params = navigation.state.params || {};
        return {
            headerTitle: i18n.t('AddMemberSearch-AddMember'),
            headerRight: (
                <Button onPress={params.startAdding} transparent><Icon name="ios-add-circle-outline"/></Button>
            )
        };
    };


    constructor(props) {
        super(props);

        this.store = this.props.screenProps.store;
        this.state = {
            search: '',
            users: [],
            usersToAdd: [],
            searched: false,
            loading: false,
            showModal: false,
            groupName: '',
            chat: this.props.navigation.getParam('passChat'),
            showConfirmAdd: false,
        };

        this.props.navigation.setParams({
            startAdding: this.addUserToChat,
        });
    }

    async componentWillMount() { }

    async componentDidMount(){
        const updatedChat = await this.store.findChat(this.state.chat.id);
        this.setState({chat: updatedChat[0]}, () => {
            this.search();
        });
    }

    _updateSearch = (searchText) => {
        this.setState({search: searchText});
        // Search for every new character typed
        this.search(searchText);
    };

    compare = (a, b) => {
        if (a.prename < b.prename)
            return -1;
        if (a.prename > b.prename)
            return 1;
        if (a.lastname < b.lastname)
            return -1;
        if (a.lastname > b.lastname)
            return 1;
        return 0;
    };

    /**
     * search for a given text if the text is not given use the state.search
     * @param text or nothing
     */
    search = (text=null) => {
        let searchText= text===null ? this.state.search : text;
        this.setState({loading: true});
        //Keyboard.dismiss();
        this.store.findUser(searchText).then((users) => {
            let length_check = users.length;
            let removed = 0;
            for(let i = 0; i < length_check; i++){
                if(this.checkIfUserInGroup(users[i - removed])){
                    users.splice(i - removed, 1);
                    removed++;
                }
            }
            this.setState({users: users});
            this.setState({loading: false});

        }).catch(error => {
            console.error('Search error:', error);
            this.store.alert = {
                type: 'error',
                title: i18n.t('AddMemberSearch-ErrorSearching'),
                msg: i18n.t('AddMemberSearch-ErrorSearchingMsg')
            };
        });
    };

    /**
     * adds a user to the List for users to add to the group, only if he is` nt already in it
     */
    addUser = (user) => {
        let found = false;
        // Check if user is allready added
        this.state.usersToAdd.forEach((current) => {
            if (current.id === user.id) {
                found = true;
                this.removeUser(current)
            }
        });

        if (!found) {
            // if the user is not in the list add him
            let users = this.state.usersToAdd;
            users.push(user);
            this.setState({usersToAdd: users});
        }
        this.search();

    };
    /**
     * remove a user from the list
     * @param user
     */
    removeUser = (user) => {
        this.state.usersToAdd.forEach((current, index) => {
            if (current.id === user.id) {
                let users = this.state.usersToAdd;
                users.splice(index, 1);
                this.setState({usersToAdd: users});
            }
        });
        this.search();
    };

    /**
     * Checks if the user is already in the addToGroup List
     * @param user to check for
     * @return Bool
     */
    checkInList=(user) =>{
        this.state.usersToAdd.forEach((current, index) => {
            if(current.id===user.id){
                return true;
            }
        });
        return false;
    };

    checkIfUserInGroup = (user) => {
        let returnvalue = false;
        this.state.chat.participants.forEach((userIn) => {
            if(user.id == userIn.id){
                returnvalue = true;
            };
        });
        return returnvalue;
    }

    addUserToChat = () => {
        this.setState({ showConfirmAdd: true });
    }

    addUserToGroup = async () => {
        // Get Participants as Objects
        const participantsObject = await this.store.getUsersForChatById(this.state.chat.id);
        // Resolve the Object
        const participants = participantsObject[0].participants;
        
        // Reduce Participants to their Ids
        const participantIds = [];
        for(let i = 0; i < participants.length; i++) {
            participantIds.push(participants[i].id);
        }
        const toAddIds = [];
        for(let i = 0; i < this.state.usersToAdd.length; i++) {
            toAddIds.push(this.state.usersToAdd[i].id);
        }

        // Deletes the User Id from the Participant Ids
        for(let i = 0; i < toAddIds.length; i++){
            participantIds.push(toAddIds[i]);
        }
        // Update the Group with the new Participant Ids
        this.store.updateGroupParticipants(this.state.chat.id, participantIds);
         // Print Message to Chat
        for(let i = 0; i < this.state.usersToAdd.length; i++){
            this.store.sendMessage({
                text: `${this.state.usersToAdd[i].prename} ${this.state.usersToAdd[i].lastname} wurde hinzugefügt`,
                sender_id: this.store.user.id,
                chat_id: this.state.chat.id,
                system: true,
            });
        }
        this.closeConfirmAdd();
        this.props.navigation.navigate('InfoGroup', {chat: this.state.chat});
    }
     closeConfirmAdd = () => {
        this.setState({ showConfirmAdd: false });
    }


    /**
     * Renders all users in the state users
     * @param user
     * @returns ListItems with users
     */
    renderSearchResult = (user) => {
        let added = false;
        this.state.usersToAdd.forEach((current) => {
            if (current.id === user.id) {
                added=true;
            }
        });
        return (
            <ListItem avatar style={{backgroundColor: 'transparent'}} button={true} onPress={() => this.addUser(user)}>
                <Left>
                    <Thumbnail source={{uri: 'https://api.adorable.io/avatars/200/' + user.email + '.png'}}/>
                </Left>
                <Body>
                <Text>{user.prename} {user.lastname}</Text>
                <Text note>{user.status}</Text>
                </Body>
                <Right>
                    { added &&
                        <Icon style={{color: 'green'}} name='ios-checkmark-circle-outline'/>
                    }
                    { !added &&
                        <Icon name='ios-add-circle-outline'/>
                    }

                </Right>
            </ListItem>
        )
    };

    renderSearchInput = () => {
        return (
            <View searchBar style={{flexDirection: 'row', padding: 10}}>

                <InputGroup rounded style={{
                    flex: 1,
                    backgroundColor: '#fff',
                    height: 30,
                    paddingLeft: 10,
                    paddingRight: 10
                }}>
                    <Icon name="ios-search"/>
                    <Input style={{height: 20}} onChangeText={(text) => this._updateSearch(text)}
                           placeholder={i18n.t('AddMemberSearch-SearchUser')}/>
                </InputGroup>
            </View>
        )
    };

    renderNoUserFound = () => {
        return (
            <List>
                <ListItem style={{backgroundColor: 'transparent'}}>
                    <Body>
                    <Text>{i18n.t('AddMemberSearch-UserNotFound')}</Text>
                    <Text note>{i18n.t('AddMemberSearch-InviteUser')}</Text>
                    </Body>
                </ListItem>
            </List>
        )
    };

    closeModal=()=>{
        this.setState({showModal: false});
    };


    render() {

        return (
            <Content>
                {this.renderSearchInput()}

                <View style={styles.addedUserBox}>
                    <ScrollView horizontal={true}>
                        {this.state.usersToAdd.map((user, index) => {
                            return (
                                <Button style={styles.addedUserButton} small key={index} iconRight rounded danger onPress={() => this.removeUser(user)}>
                                    <Text>{user.prename} {user.lastname}</Text>
                                    <Icon name="ios-trash-outline"/>
                                </Button>
                            )
                        })}
                    </ScrollView>
                </View>

                {   //render a spinner if loading is active
                    this.state.loading &&
                    <Spinner color='rgb(216, 0, 48)'/>
                }

                {   // if not search results are found
                    (this.state.users.length === 0 && !this.state.loading ) &&
                    this.renderNoUserFound()
                }

                {   // if some users are found
                    (this.state.users.length !== 0 && !this.state.loading) &&
                    <List dataArray={this.state.users} renderRow={this.renderSearchResult}></List>
                }
                <ModalInput
                    text={i18n.t('AddMemberSearch-WantToAdd')}
                    placeholder= {this.state.usersToAdd.length>1?
                         `${this.state.usersToAdd.length} ${i18n.t('AddMemberSearch-User')}` : 
                         (this.state.usersToAdd.length == 0) ? ' ' : `${this.state.usersToAdd[0].prename} ${this.state.usersToAdd[0].lastname}`}
                    visible={this.state.showConfirmAdd}
                    positiv={this.addUserToGroup}
                    negativ={this.closeConfirmAdd}
                    maxLength={0}
                />
            </Content>
        );

    }
}
