import React from 'react';
import { Component } from 'react';
import {StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { TextInput, HelperText } from 'react-native-paper';
import {BLUE} from './../utils/commonColors';

const initialState = {
    name: null,
    email: null,
    password: null,
    inputError: {
        name: null,
        email: null,
        password: null
    },
    registerError: null
}

export default class RegisterScreen extends Component{

    constructor(){
        super();
        this.state = initialState;
        this.isValidated = this.isValidated.bind(this);
        this.register = this.register.bind(this);
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
            this.setState({inputError: initialState.error});
            return true;
        }
    }

    register(){
        let {name, password, email} = this.state;
        if(this.isValidated()){
            console.log('Validated')
        }
    }

    render(){
        let {
            name, 
            email, 
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
                        onChangeText={name => this.setState({name: name})}
                    />
                    {inputError.name != null && (
                        <HelperText type="error" visible={true}>
                            {error.name}
                        </HelperText>
                    )}
                    <TextInput
                        label="Email"
                        value={email}
                        style={styles.input}
                        onChangeText={email => this.setState({email: email})}
                    />
                    {inputError.email != null && (
                        <HelperText type="error" visible={true}>
                            {error.email}
                        </HelperText>
                    )}
                    <TextInput
                        label="Password"
                        value={password}
                        style={styles.input}
                        onChangeText={password => this.setState({password: password})}
                    />
                    {inputError.password != null && (
                        <HelperText type="error" visible={true}>
                            {error.password}
                        </HelperText>
                    )}
                    <TouchableOpacity 
                        style={styles.button} 
                        activeOpacity={.6}
                        onPress={this.register}>
                        <Text style={styles.buttonLabel}>Register</Text>
                    </TouchableOpacity>
                   {registerError != null && (
                        <HelperText type="error" style={styles.errorMessage}>
                            Something when wrong
                        </HelperText>
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