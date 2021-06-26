import React from 'react';
import { Component } from 'react';
import {StyleSheet, Text, ScrollView, Image, ActivityIndicator, View} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { TextInput } from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { BLUE } from '../utils/commonColors';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import firestore from '@react-native-firebase/firestore';
import { getUser } from '../utils/sharedPreferences';
import storage from '@react-native-firebase/storage';

const imageoptions = {
    mediaType: 'photo',
    quality: .4,
}

export default class ProfileScreen extends Component{

    constructor(){
        super();
        this.state = {
            name: null,
            status: null,
            imageUrl: null,
            loading: false,
            imageType: null
        }
        this.pickImage = this.pickImage.bind(this);
        this.clickImage = this.clickImage.bind(this);
        this.uploadProfileData = this.uploadProfileData.bind(this);
    }

    pickImage(){
        let context = this;
        launchImageLibrary(imageoptions, function(data){
            if(!data.didCancel){
                let {uri, type} = data.assets[0]
                context.setState({imageUrl: uri, imageType: type.split('/')[1]});
            }
        })
    }

    clickImage(){
        let context = this;
        launchCamera(imageoptions, function(data){
            if(!data.didCancel){
                let {uri, type} = data.assets[0]
                context.setState({imageUrl: uri, imageType: type.split('/')[1]});
            }
        })
    }

    async uploadProfileData(){
        this.setState({loading: true});
        let reference = null, pathToImage = null;
        let {name, status, imageUrl, imageType} = this.state;
        let {navigation} = this.props;
        let user = await getUser();
       
        try {
            if(imageUrl != null){
                let imageName = new Date().getTime() + '.' + imageType; 
                reference = await storage().ref(imageName);
                await reference.putFile(imageUrl);
                pathToImage = await reference.getDownloadURL();
            }
            await firestore().collection('users').doc(user.id).update({
               profile: {
                name: name,
                status: status,
                imageUrl: pathToImage
               }
            })
            this.setState({loading: false});
            navigation.replace('Home');
        } catch (error) {
            console.log(error)
            this.setState({loading: false});
        }
    }

    render(){
        let {name, status, imageUrl, loading} = this.state;
        return (
            <ScrollView contentContainerStyle={styles.container}>
                <View 
                    style={styles.imageContainer} >
                    {imageUrl == null && (
                        <MaterialIcons name="image" size={34} color="white"/>
                    )}
                    {imageUrl != null && (
                        <Image 
                            source={{uri: imageUrl}} 
                            style={styles.image}/>
                    )}
                </View>
                <View style={{
                        flexDirection: 'row', 
                        justifyContent: 'center', 
                        marginBottom: 30
                    }}>
                    <TouchableOpacity
                        onPress={this.pickImage}>
                        <MaterialIcons 
                            name="add-to-photos"
                            size={24}
                            color={BLUE}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{marginLeft: 20}}
                        onPress={this.clickImage}>
                        <MaterialIcons 
                            name="camera"
                            size={24}
                            color={BLUE}
                        />
                    </TouchableOpacity>
                </View>
                <TextInput
                    placeholder="Public name"
                    mode="outlined"
                    style={styles.input}
                    value={name}
                    onChangeText={value => this.setState({name: value})}
                />
                <TextInput
                    placeholder="Status"
                    mode="outlined"
                    style={styles.input}
                    value={status}
                    onChangeText={value => this.setState({status: value})}
                />

                <TouchableOpacity 
                    style={styles.uploadButton}
                    activeOpacity={.6}
                    onPress={this.uploadProfileData}
                    disabled={loading}>
                    {loading && (
                        <ActivityIndicator size="large" color="white"/>
                    )}
                    {!loading && (
                        <Text style={styles.uploadButtonLabel}>Upload</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        width: '100%',
        padding: 20
    },
    imageContainer: {
        height: 120,
        width: 120,
        borderRadius: 60,
        backgroundColor: 'lightgrey',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        alignSelf: 'center'
    },
    image: {
        height: 120,
        width: 120,
        borderRadius: 60,
    },
    input: {
        height: 50,
        marginTop: 20,
        fontSize: 14,
        overflow: 'hidden'
    },
    uploadButton: {
        height: 50,
        backgroundColor: BLUE,
        marginTop: 100,
        marginBottom: 50,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5
    },
    uploadButtonLabel: {
        color: 'white',
        fontSize: 18
    }
})