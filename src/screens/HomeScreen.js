import React from 'react';
import { Component } from 'react';
import {StyleSheet, Text, View } from 'react-native';
import { getUser } from '../utils/sharedPreferences';
import SideDrawer from '../navigations/homeSideDrawer';

export default class HomeScreen extends Component{

    async componentDidMount(){
        try {
            // const user =  await getUser();
            // console.log(user);
        } catch (error) {
            
        }
    }

    render(){
        return (
            <SideDrawer />
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})