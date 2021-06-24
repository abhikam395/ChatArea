import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import HomeScreen from './../screens/HomeScreen';
import ChatScreen from './../screens/ChatScreen';
import LoginScreen from './../screens/LoginScreen';
import RegisterScreen from './../screens/RegisterScreen';
import UserFormScreen from './../screens/UserFormScreen';
import UsersScreen from './../screens/UsersScreen';


const Stack = createStackNavigator();

function MainNavigation(){
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Register">
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Register" component={RegisterScreen} />
                <Stack.Screen name="Users" component={UsersScreen} />
                <Stack.Screen name="UserForm" component={UserFormScreen} />
                <Stack.Screen name="Chat" component={ChatScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default MainNavigation;