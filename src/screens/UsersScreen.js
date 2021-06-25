import React from 'react';
import { Component } from 'react';
import {StyleSheet, FlatList, View, Text, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { getUser } from '../utils/sharedPreferences';

export default class UsersScreen extends Component{

    constructor(){
        super();
        this.state = {
            users: []
        }
        this.userCollection = firestore().collection('users');
    }

    async componentDidMount(){
        try {
            let user = await getUser();
            const users = await this.userCollection.get();
            let userList = [];
            users.forEach(data => {
                if(data.id == user.id) return;
                let {name, email} = data.data();
                userList.push({id: data.id, name: name, email: email});
            })
            this.setState({users: userList});
        } catch (error) {
            console.log(error)
        }
    }

    renderItem(item, navigation){
        let {name} = item;
        return (
            <TouchableOpacity 
                style={styles.card}
                activeOpacity={.8}
                onPress={() => navigation.navigate('Chat', {user: item})}>
                <Text>{name}</Text>
            </TouchableOpacity>
        )
    }

    render(){
        let {users} = this.state;
        let {navigation} = this.props;
        return (
            <View style={styles.container}>
                <FlatList
                    data={users}
                    renderItem={({item}) => this.renderItem(item, navigation)}
                    keyExtractor={(item, index) => index.toString()}
                    contentContainerStyle={{
                        padding: 10
                    }}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    card: {
        elevation: 1,
        backgroundColor: 'white',
        height: 100,
        justifyContent: 'center',
        padding: 10,
        marginBottom: 10
    }
})