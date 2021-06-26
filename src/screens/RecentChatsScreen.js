import React from 'react';
import { Component } from 'react';
import {StyleSheet, FlatList, View, Text } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { getUser } from '../utils/sharedPreferences';
import moment from 'moment';

export default class RecentChatsScreen extends Component{

    constructor(){
        super();
        this.state = {
            chats: []
        }
        this.renderItem = this.renderItem.bind(this);
        this.userCollection = firestore().collection('users');
        this.chatCollection = firestore().collection('chats');
    }


    async componentDidMount(){
        let groupIds = [], recentChats = [];
        this.user = await getUser();
        const groups = await this.userCollection.doc(this.user.id).collection('groups').get();
        groups.forEach(group => {
            groupIds.push(group.id);
        })
        if(groupIds.length > 0){
            const chats = await this.chatCollection.where(firestore.FieldPath.documentId(), 'in', [...groupIds]).get();
            chats.docs.forEach(data => {
                recentChats.push(data.data());
            })
            this.setState({chats: recentChats});
        }
    }

    renderItem({item}){
        let {from, to, lastMessage, timeStamp} = item;
        let name = from.id != this.user.id ? from.name : to.name;
        return (
            <View style={styles.card}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text style={{fontSize: 13, fontWeight: 'bold'}}>{name}</Text>
                    <Text style={{fontSize: 10}}>{moment(timeStamp).fromNow()}</Text>
                </View>
                <Text style={{marginTop: 10}}>{lastMessage}</Text>
            </View>
        )
    }

    render(){
        let {chats} = this.state;
        return (
            <View style={styles.container}>
                {chats.length == 0 && (
                    <Text 
                        style={{
                            fontSize: 14, 
                            fontWeight: 'bold',

                        }}>Start conversation with your friends.
                    </Text>
                )}
                {chats.length != 0}{
                    <FlatList
                        data={this.state.chats}
                        renderItem={this.renderItem}
                        keyExtractor={(item, index) => index.toString()}
                />
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 10,
        elevation: 1,
        padding: 10,
        marginBottom: 20,
    }
})