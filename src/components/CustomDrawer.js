import React, {Component} from 'react';
import {StyleSheet, View, Text, ActivityIndicator, Image} from 'react-native';
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { deleteUser, getUser } from '../utils/sharedPreferences';
import { CommonActions } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';

export default class CustomDrawerContent extends Component{

  constructor(){
    super();
    this.state = {
        profile: null
    }
  }

  async componentDidMount(){
    try {
      const user = await getUser();
      const userData = await firestore().collection('users').doc(user.id).get();
      const profile = userData.exists ? userData.data().profile : null;
      this.setState({profile: profile});
    } catch (error) {
      console.log(error);
    }
  }
  
  render(){
      let {profile} = this.state;
      let {navigation} = this.props;
      return (
        <DrawerContentScrollView {...this.props}>
          {profile != null && (
            <View style={styles.profileContainer}>
              <Image source={{uri: profile.imageUrl}} style={styles.userImage}/>
              <Text style={styles.userName}>{profile.name}</Text>
              <Text style={styles.userStatus}>{profile.status}</Text>
            </View>
          )}
          <DrawerItemList {...this.props} />
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
      )
  }
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flex: 1,
    },
    profileContainer: {
      height: 180,
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderBottomColor: '#eeeeee',
      borderBottomWidth: 1
    },
    userImage: {
      height: 100,
      width: 100,
      borderRadius: 50
    },
    userName: {
      fontSize: 16,
      fontWeight: 'bold',
      marginTop: 15
    },
    userStatus: {
      fontSize: 12
    }
})