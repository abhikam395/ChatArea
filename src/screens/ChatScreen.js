import React, { Component, createRef } from 'react';
import {StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { getUser } from '../utils/sharedPreferences';
import {generateId} from '../utils/generateUniqueId';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { FlatList } from 'react-native-gesture-handler';
import moment from 'moment';

export default class ChatScreen extends Component{

    constructor(props){
        super(props);
        this.state = {
            message: '',
            chats: []
        }
        let {route, navigation} = props;
        let {user} = route.params;
        this.user = user;
        navigation.setOptions({ title: user.name });
        this.sendMessage = this.sendMessage.bind(this);
        this.groupCollection =  firestore().collection('groups');
        this.userCollection = firestore().collection('users');
        this.chatCollection = firestore().collection('chats');
        this.messageCollection = firestore().collection('messages');
        this.renderChatItem = this.renderChatItem.bind(this);
        this.groupId = null;
        this.listRef = createRef();
    }

    async componentDidMount(){
        try {
            this.self = await getUser();
            this.group = await 
                this.groupCollection.where('members', '==', {[this.user.id] : true, [this.self.id]: true}).limit(1).get();
            if(this.group.docs.length != 0){
                this.groupId = this.group.docs[0].id;
            }
            else {
                await this.createGroup(this.self.id, this.user.id);
            }
            
            let chats = [];
            let context = this;
            function onResult(QuerySnapshot) {
                let { docs} = QuerySnapshot;
                if(chats.length != 0){
                    chats.push(docs[chats.length - 1]);  
                    console.log(docs[chats.length - 1].data()); 
                }
                else {
                    docs.forEach(data => {
                        chats.push(data.data());
                    });
                }
                context.setState({chats: chats});
            }
            
            function onError(error) {
                console.error(error);
            }
            this.unsubscribe = await this.messageCollection
                .doc(this.groupId)
                .collection('messages')
                .orderBy('timestamp', 'asc')
                .onSnapshot(onResult, onError);
        } catch (error) {
            console.log(error)
        }
    }

    async createGroup(creatorId, userId){
        try {
            const batch = firestore().batch();
            let groupRef = this.groupCollection.doc();
            batch.set(groupRef, { members: {
                [creatorId]: true,
                [userId]: true
            }})
            batch.set(this.userCollection.doc(creatorId).collection('groups').doc(userId), {state: true});
            batch.set(this.userCollection.doc(userId).collection('groups').doc(creatorId), {state: true});
            batch.commit();
            this.groupId = groupRef.id;
        } catch (error) {
            console.log(error)
        }
    }

    sendMessage(){
        let {message} = this.state;
        console.log(message)
        if(message.length == 0) return;
        try {
            const batch = firestore().batch();
            batch.set(this.chatCollection.doc(this.groupId), {
                senderId: this.self.id,
                name: this.self.name,
                lastMessage: message,
                timestamp: new Date().getTime()
            })
            batch.set(this.messageCollection.doc(this.groupId).collection('messages').doc(), {
                senderId: this.self.id,
                name: this.self.name,
                message: message,
                timestamp: new Date().getTime()
            })
            batch.commit()
            this.setState({message: ''})
        } catch (error) {
            console.log(error);
        }
    }

    componentWillUnmount(){
        this.unsubscribe();
    }

    renderChatItem({item}){
        let {senderId, senderName, message, timestamp} = item;
        let isSelfChat = senderId == this.self.id ? true : false;
        const ago = moment(timestamp).fromNow();
        return (
            <View style={isSelfChat ? styles.selfChat : styles.chat}>
                <Text>{message}</Text>
                <Text style={styles.ago}>{ago}</Text>
            </View>
        )
    }

    render(){
        return (
            <View style={styles.container}>
                {this.state.chats.length > 0 && (
                    <FlatList
                        ref={this.listRef}
                        data={this.state.chats}
                        renderItem={this.renderChatItem}
                        keyExtractor={(item, index) => index.toString()}
                        contentContainerStyle={{padding: 10}}
                    />
                )}
                <View style={styles.chatBox}>
                    <TextInput 
                        placeholder="Write message .." 
                        style={styles.input}
                        value={this.state.message}
                        onChangeText={(message) => this.setState({message: message})}/>
                    <TouchableOpacity 
                        style={styles.sendButton} 
                        onPress={this.sendMessage}>
                        <MaterialIcons name="send" size={26}/>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    chatBox: {
        backgroundColor: 'white',
        position: 'absolute',
        width: '100%',
        height: 70,
        bottom: 0,
        flexDirection: 'row',
        alignItems: 'center'
    },
    input: {
        backgroundColor: '#eeeeee',
        flex: 1,
        margin: 10,
        borderRadius: 20,
        padding: 10,
    },
    sendButton: {
        width: 60,
        marginHorizontal: 5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    selfChat: {
        minHeight: 50,
        padding: 10,
        alignSelf: 'flex-end',
        backgroundColor: '#dcedc8',
        marginBottom: 10,
        alignItems: 'center',
    },
    chat: {
        minHeight: 50,
        padding: 10,
        alignSelf: 'flex-start',
        backgroundColor: '#e0f7fa',
        marginBottom: 10,
        alignItems: 'center',
    },
    ago: {
        fontSize: 8,
        alignSelf: 'flex-end'
    }
})