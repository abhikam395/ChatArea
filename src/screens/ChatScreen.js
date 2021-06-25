import React, { Component, createRef } from 'react';
import {StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { getUser } from '../utils/sharedPreferences';
import {generateId} from '../utils/generateUniqueId';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { FlatList } from 'react-native-gesture-handler';
import moment from 'moment';

export default class ChatScreen extends Component{

    constructor(){
        super();
        this.state = {
            message: '',
            chats: []
        }
        this.sendMessage = this.sendMessage.bind(this);
        this.groupCollection =  firestore().collection('groups');
        this.chatCollection = firestore().collection('chats');
        this.renderChatItem = this.renderChatItem.bind(this);
        this.groupId = null;
        this.listRef = createRef();
    }

    async componentDidMount(){
        let {route, navigation} = this.props;
        let {user} = route.params;
        this.user = user;
        navigation.setOptions({
            title: this.user.name
        });
        try {
            this.self = await getUser();
            this.group1 = await this.groupCollection.where('creatorId', '==', this.self.id)
                .where('userId', '==', this.user.id).limit(1).get();
            this.group2 = await this.groupCollection.where('creatorId', '==', this.user.id)
                .where('userId', '==', this.self.id).limit(1).get();
            if(this.group1.docs.length != 0 || this.group2.docs.length != 0){
                this.groupId = this.group1.docs.length != 0 ? this.group1.docs[0].id : this.group2.docs[0].id;
            }
            else {
                await this.createGroup(this.self.id, this.user.id);
            }
            let context = this;
            let {chats} = context.state;
            function onResult(QuerySnapshot) {
                let {docs} = QuerySnapshot;
                const chatList = [];
                if(docs.length == 0) return;
                docs.forEach(data => {
                    chatList.push(data.data());
                })
                context.setState({chats: chatList});
                console.log(Object.keys(QuerySnapshot))
                console.log(QuerySnapshot['docs'].length)
              }
              
            function onError(error) {
                console.error(error);
            }

            this.chatCollection.where('groupId', '==' , this.groupId).onSnapshot(onResult, onError);
            if(this.state.chats.length != 0)
                this.listRef.current.scrollToIndex(this.state.chats.length - 1)
        } catch (error) {
            console.log(error)
        }
    }

    async createGroup(creatorId, userId){
        let uniqueId = generateId();
        try {
            this.group = await this.groupCollection.doc(uniqueId).set({
                id: uniqueId,
                creatorId: creatorId,
                userId: userId
            });
            this.groupId = uniqueId;
        } catch (error) {
            console.log(error)
        }
    }

    async sendMessage(){
        let {message} = this.state;
        if(message.length == 0) return;
        try {
            await this.chatCollection.add({
                groupId: this.groupId,
                message: this.state.message,
                from: {
                    id: this.self.id,
                    name: this.self.name
                },
                to: {
                    id: this.user.id,
                    name: this.user.name,
                },
                createdAt: new Date()
            })
            this.setState({message: ''})
        } catch (error) {
            console.log(error)
        }
    }

    renderChatItem({item}){
        let {from, to, message, createdAt} = item;
        let isSelfChat = from.id == this.self.id;
        const ago = moment(createdAt).fromNow();
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
                <FlatList
                    ref={this.listRef}
                    data={this.state.chats}
                    renderItem={this.renderChatItem}
                    keyExtractor={(item, index) => index.toString()}
                    contentContainerStyle={{padding: 10}}
                />
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