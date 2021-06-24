import React from 'react';
import { Component } from 'react';
import {StyleSheet, Text, View } from 'react-native';

export default class RecentChatsScreen extends Component{
    render(){
        return (
            <View style={styles.container}>
                <Text>RecentChatsScreen</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})