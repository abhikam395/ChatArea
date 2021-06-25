import React, {Component} from 'react';
import {View} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import HomeScreen from './../screens/HomeScreen';
import ChatScreen from './../screens/ChatScreen';
import LoginScreen from './../screens/LoginScreen';
import RegisterScreen from './../screens/RegisterScreen';
import UserFormScreen from './../screens/UserFormScreen';
import UsersScreen from './../screens/UsersScreen';
import { getUser } from '../utils/sharedPreferences';
import { ActivityIndicator } from 'react-native-paper';


const Stack = createStackNavigator();

async function userInfo(){
    return await getUser();
}

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

    render(){
        let {user} = this.state;
        if( user === undefined){
            return <ActivityIndicator style={{flex: 1}} size="large"/>
        }
        return (
                <NavigationContainer>
                    <Stack.Navigator initialRouteName={user != null ? 'Home' : 'Register'}>
                        <Stack.Screen 
                            name="Home" 
                            component={HomeScreen} 
                            options={{headerShown: false}} />
                        <Stack.Screen name="Login" component={LoginScreen} />
                        <Stack.Screen name="Register" component={RegisterScreen} />
                        <Stack.Screen name="Users" component={UsersScreen} />
                        <Stack.Screen name="UserForm" component={UserFormScreen} />
                        <Stack.Screen name="Chat" component={ChatScreen} options={(navigation) => ({
                            title: navigation.route.params.title
                        })}/>
                    </Stack.Navigator>
                </NavigationContainer>
            )
    }
}