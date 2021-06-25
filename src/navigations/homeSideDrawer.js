import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import RecentChatsScreen from '../screens/RecentChatsScreen';
import UsersScreen from './../screens/UsersScreen';
import CustomDrawerContent from '../components/CustomDrawer';

const Drawer = createDrawerNavigator();

export default function SideDrawer(){
    
    return (
        <Drawer.Navigator
            screenOptions={{headerShown: true}}
            initialRouteName="Users"
            drawerContent={(props) => <CustomDrawerContent {...props}/>}>
            <Drawer.Screen name="RecentChats" component={RecentChatsScreen}/>
            <Drawer.Screen name="Users" component={UsersScreen}/>
        </Drawer.Navigator>
    )
}