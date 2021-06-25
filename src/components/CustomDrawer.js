import React from 'react';
import {StyleSheet} from 'react-native';
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { deleteUser } from '../utils/sharedPreferences';
import { CommonActions } from '@react-navigation/native';

export default function CustomDrawerContent(props) {
    let {navigation} = props;
    return (
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        <DrawerItem
            label="Logout"
            onPress={() => {
                deleteUser();
                const resetAction = CommonActions.reset({
                    index: 0,
                    routes: [{name: 'Register'}],
                  });
              
                navigation.dispatch(resetAction);
            }}
        />
      </DrawerContentScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flex: 1,
    }
})