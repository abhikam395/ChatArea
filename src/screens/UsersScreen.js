import React from 'react';
import { Component } from 'react';
import {StyleSheet, Text, View } from 'react-native';

export default class UsersScreen extends Component{
    render(){
        return (
            <View style={styles.container}>
                <Text>UsersScreen</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})