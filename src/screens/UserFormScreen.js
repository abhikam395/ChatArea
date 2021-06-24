import React from 'react';
import { Component } from 'react';
import {StyleSheet, Text, View } from 'react-native';

export default class UserFormScreen extends Component{
    render(){
        return (
            <View style={styles.container}>
                <Text>UserFormScreen</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})