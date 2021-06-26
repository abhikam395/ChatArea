import React from 'react';
import { Component } from 'react';
import {StyleSheet, Text, View } from 'react-native';
import { getUser } from '../utils/sharedPreferences';
import SideDrawer from '../navigations/homeSideDrawer';
import firestore from '@react-native-firebase/firestore';

const INTERVAL = 10 * 1000; // 30 seconds

export default class HomeScreen extends Component{

    constructor(){
        super();
        this.lastSeenCollection = firestore().collection('lastseen');
    }

    async componentDidMount(){
        let context = this;
        const user = await getUser();
        await this.lastSeenCollection.doc(user.id).set({seen: new Date().getTime()})
        try {
            this.interval =  setInterval(async () => {
                await context.lastSeenCollection.doc(user.id).set({seen: new Date().getTime()})
            }, INTERVAL)
        } catch (error) {
            
        }
    }

    componentWillUnmount(){
        clearInterval(this.interval);
        console.log('clear')
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