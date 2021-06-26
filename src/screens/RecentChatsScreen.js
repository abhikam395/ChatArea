import React from 'react';
import { Component } from 'react';
import {StyleSheet, FlatList, View, Text, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { getUser } from '../utils/sharedPreferences';
import moment from 'moment';
import { ActivityIndicator } from 'react-native-paper';
import { BLUE } from '../utils/commonColors';

export default class RecentChatsScreen extends Component{

    constructor(){
        super();
        this.state = {
            chats: [],
            loading: false
        }
        this.renderItem = this.renderItem.bind(this);
        this.userCollection = firestore().collection('users');
        this.chatCollection = firestore().collection('chats');
    }


    async componentDidMount(){
        let groupIds = [], recentChats = [];
        this.setState({loading: true})
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
            this.setState({chats: recentChats, loading: false});
        }
        else {
            this.setState({loading: false})
        }
    }

    renderItem({item}){
        let {navigation} = this.props;
        let {from, to, lastMessage, timeStamp} = item;
        let user = from.id != this.user.id ? from : to;
        return (
            <TouchableOpacity 
                style={styles.card}
                onPress={() => navigation.navigate('Chat', {user: user})}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text style={{fontSize: 13, fontWeight: 'bold'}}>{user.name}</Text>
                    <Text style={{fontSize: 10}}>{moment(timeStamp).fromNow()}</Text>
                </View>
                <Text style={{marginTop: 10}}>{lastMessage}</Text>
            </TouchableOpacity>
        )
    }

    render(){
        let {chats, loading} = this.state;
        return (
            <View style={styles.container}>
                {loading && (
                    <ActivityIndicator 
                        size="small" 
                        color={BLUE} 
                        style={{marginTop: 20}}
                    />
                )}
                {chats.length == 0 &&  loading == false && (
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