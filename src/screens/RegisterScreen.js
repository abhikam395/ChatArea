import React from 'react';
import { Component } from 'react';
import {StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { TextInput, HelperText, ActivityIndicator } from 'react-native-paper';
import {BLUE} from './../utils/commonColors';
import auth from '@react-native-firebase/auth';
import SharedPreferenes from 'react-native-shared-preferences';
import firestore from '@react-native-firebase/firestore';
import { generateId, generateUniqueId } from '../utils/generateUniqueId';
import { setUser } from '../utils/sharedPreferences';

const initialState = {
    name: null,
    email: null,
    password: null,
    inputError: {
        name: null,
        email: null,
        password: null
    },
    registerError: null,
    loading: false
}

export default class RegisterScreen extends Component{

    constructor(){
        super();
        this.state = initialState;
        this.isValidated = this.isValidated.bind(this);
        this.register = this.register.bind(this);
        this.userCollection = firestore().collection('users');
    }

    isValidated(){
        let {name, email, password} = this.state;
        let error = {};
        let emailParts = email != null ? email.split('@') : [];
        if(name == null || name.length < 3){
            if(name == null)
                error.name = "Entry input";
            else
                error.name = "Name must be more than 2 characters"
        }
        if(email == null || emailParts[1] != 'gmail.com'){
            if(email == null)
                error.email = "Entry email";
            else
                error.email = "It doesn't looks like email"
        }
        if(password == null || password.length < 5){
            if(password == null)
                error.password = "Entry password";
            else
                error.password = "Password must be more than 4 characters"
        }

        if(Object.keys(error).length != 0){
            this.setState({inputError: error});
        }
        else {
            this.setState({
                inputError: initialState.inputError, 
                registerError: null
            });
            return true;
        }
    }

    async register(){
        let {name, password, email} = this.state;
        let {navigation} = this.props;
        if(this.isValidated()){
            this.setState({loading: true})
            try {
                let user = await  this.userCollection
                    .where('email', '==', email)
                    .limit(1)
                    .get();
                let data = user.docs[0] || null;
                if(data == null ){
                    let uniqueId = generateUniqueId().toString();
                    let data = this.userCollection.doc(uniqueId)
                        .set({
                            name: name,
                            password: password,
                            email: email,
                        })
                    if(data != null){
                        this.setState({loading: false})
                        setUser({id: uniqueId, name: name, email: email});
                        navigation.navigate('Home');
                    }
                }
                else {
                    this.setState({loading: false})
                    // this.setState({registerError: 'User already exists'});
                    setUser({id: data.id, name: data.data().name, email: data.data().email});
                    navigation.navigate('Home');
                }
            } catch (error) {
                console.log(error)
            }
        }
    }

    render(){
        let {
            name, 
            email,
            loading,
            password, 
            inputError, 
            registerError
        } = this.state;
        return (
            <View style={styles.container}>
                <View style={styles.contentContainer}>
                    <TextInput
                        label="Name"
                        value={name}
                        style={styles.input}
                        textContentType="name"
                        onChangeText={name => this.setState({name: name})}
                    />
                    {inputError.name != null && (
                        <HelperText type="error" visible={true}>
                            {inputError.name}
                        </HelperText>
                    )}
                    <TextInput
                        label="Email"
                        value={email}
                        style={styles.input}
                        keyboardType="email-address"
                        onChangeText={email => this.setState({email: email})}
                    />
                    {inputError.email != null && (
                        <HelperText type="error" visible={true}>
                            {inputError.email}
                        </HelperText>
                    )}
                    <TextInput
                        label="Password"
                        value={password}
                        style={styles.input}
                        textContentType="password"
                        onChangeText={password => this.setState({password: password})}
                    />
                    {inputError.password != null && (
                        <HelperText type="error" visible={true}>
                            {inputError.password}
                        </HelperText>
                    )}
                    <TouchableOpacity 
                        style={styles.button} 
                        activeOpacity={.6}
                        disabled={loading}
                        onPress={this.register}>
                        <Text style={styles.buttonLabel}>Register</Text>
                    </TouchableOpacity>
                   {registerError != null && (
                        <HelperText type="error" style={styles.errorMessage}>
                            {registerError}
                        </HelperText>
                   )}
                   {loading && (
                       <ActivityIndicator size="large"/>
                   )}
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        
    },
    contentContainer: {
        paddingHorizontal: 20
    },
    input: {
        marginTop: 30,
        fontSize: 14
    },
    button: {
        height: 56,
        marginTop: 50,
        marginBottom: 10,
        backgroundColor: BLUE,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5
    },
    buttonLabel: {
        fontSize: 16,
        color: 'white',
        fontWeight: 'bold'
    },
    errorMessage: {
        alignSelf: 'center'
    }
})