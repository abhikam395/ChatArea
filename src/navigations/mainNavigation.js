import React, {Component} from 'react';
import {View, Text} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import HomeScreen from './../screens/HomeScreen';
import ChatScreen from './../screens/ChatScreen';
import LoginScreen from './../screens/LoginScreen';
import RegisterScreen from './../screens/RegisterScreen';
import UsersScreen from './../screens/UsersScreen';
import { getUser } from '../utils/sharedPreferences';
import { ActivityIndicator } from 'react-native-paper';
import ProfileScreen from '../screens/ProfileScreen';
import { BLUE } from '../utils/commonColors';
import moment from 'moment';


const Stack = createStackNavigator();

export default class MainNavigation extends Component{

    constructor(){
        super();
        this.state = {
            user: undefined
        }
    }

    componentDidMount(){
        getUser().then(user => {
            if(user != null){
                this.setState({user: user});
            }
            else{
                this.setState({user: null})
            }
        })
        .catch(error => {
            console.log(error)
        })
    }

    getUserSeenTime(time){
        let oldTime =  Math.round(new Date(time).getTime() / 1000);
        let currentTime = Math.round(new Date().getTime() / 1000);
        let diff = currentTime - oldTime;
        if(diff >= 0 && diff <= 50){
            return "Online"
        }
        return moment(time).fromNow();
    }

    render(){
        let {user} = this.state;
        if( user === undefined){
            return <ActivityIndicator style={{flex: 1}} size="large"/>
        }
        return (
            <NavigationContainer>
                <Stack.Navigator initialRouteName={user != null ? 'Home': 'Register'}>
                    <Stack.Screen 
                        name="Home" 
                        component={HomeScreen} 
                        options={{headerShown: false}} />
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="Register" component={RegisterScreen} />
                    <Stack.Screen name="Users" component={UsersScreen} />
                    <Stack.Screen name="Profile" component={ProfileScreen} />
                    <Stack.Screen 
                        name="Chat" 
                        component={ChatScreen} 
                        options={(navigation) => ({
                            title: navigation.route.params.title,
                            headerRight: () => {
                                let {lastseen} = navigation.route.params;
                                return (
                                    <Text style={{
                                            fontSize: 10, 
                                            color: BLUE,
                                             fontWeight: 'bold'
                                        }}>
                                        {this.getUserSeenTime(lastseen)}
                                    </Text>
                                )
                            },
                            headerRightContainerStyle: {
                                marginRight: 20,
                            }
                        })}
                    />
                </Stack.Navigator>
            </NavigationContainer>
            )
    }
}
