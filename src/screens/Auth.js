import React, { Component } from 'react';
import { View, ImageBackground, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';

import backgroundImage from '../../assets/imgs/login.jpg';

import commonStyles from '../commonStyles';

import AuthInput from '../components/AuthInput';

import { showError, showSuccess, server } from '../common';
import axios from 'axios';

import AsyncStorage from '@react-native-community/async-storage';

const initialState = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    stageNew: false
};

class Auth extends Component {

    state = { ...initialState };

    signinOrSignup = () => {
        if (this.state.stageNew) {
            this.signup();
        } else {
            this.signin();
        }
    }

    signin = async () => {
        await axios.post(`${server}/signin`, {
            email: this.state.email,
            password: this.state.password,
        })
        .then(res => {
            AsyncStorage.setItem('userData', JSON.stringify(res.data));
            axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
            
            this.props.navigation.navigate('Home', res.data);
        })
        .catch(err => {
            console.log(err.msg);
            showError(err);
        });
    }

    signup = async () => {
        try {
            await axios.post(`${server}/signup`, { 
                name: this.state.name, 
                email: this.state.email, 
                password: this.state.password,
                confirmPassword: this.state.confirmPassword
            });

            showSuccess('User created successfully!');
            this.setState(initialState);
        } catch (e) {
            showError(e);
        }
    }

    render() {
        const validations = [];
        validations.push(this.state.email && this.state.email.includes('@'));
        validations.push(this.state.password && this.state.password >= 6);
        
        if (this.state.stageNew) {
            validations.push(this.state.name && this.state.name.trim().length >= 3);
            validations.push(this.state.password === this.state.confirmPassword);
        }

        const validForm = validations.reduce((total, act) => total && act);

        return (
            <ImageBackground source={backgroundImage} style={styles.background}>
                <Text style={styles.title}>Tasks</Text>
                <View style={styles.formContainer}>
                    <Text style={styles.subTitle}>
                        {this.state.stageNew ? 'Create your account' : 'Do Login'}
                    </Text>
                    {this.state.stageNew && 
                        <AuthInput 
                            icon="user" 
                            placeholder="Nome" 
                            onChangeText={text => this.setState({ name: text })}
                            value={this.state.name} 
                            style={styles.input} 
                        />
                    }
                    <AuthInput 
                        icon="at" 
                        placeholder="E-mail" 
                        onChangeText={text => this.setState({ email: text })}
                        value={this.state.email} 
                        style={styles.input} 
                    />
                    <AuthInput 
                        icon="lock" 
                        placeholder="Password" 
                        onChangeText={text => this.setState({ password: text })}
                        value={this.state.password} 
                        secureTextEntry={true} 
                        style={styles.input} 
                    />
                    {this.state.stageNew && 
                        <AuthInput 
                            icon="asterisk" 
                            placeholder="Confirm Password" 
                            onChangeText={text => this.setState({ confirmPassword: text })}
                            value={this.state.confirmPassword} 
                            secureTextEntry={true} 
                            style={styles.input} 
                        />
                    }
                    <TouchableOpacity onPress={this.signinOrSignup} disabled={!validForm}>
                            <View style={[styles.button, validForm ? {} : { backgroundColor: '#AAA' }]}>
                                <Text style={styles.buttonText}>
                                    {this.state.stageNew ? 'SignUp' : 'SingIn'}
                                </Text>
                            </View>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => this.setState({ stageNew: !this.state.stageNew })}
                    style={{ padding: 10 }} activeOpacity={0.6}>
                        <Text style={styles.buttonText}>
                            {this.state.stageNew ? 'Already have an account?' : 'I don\'t have an account!'}
                        </Text>
                </TouchableOpacity>
            </ImageBackground>
        );
    };
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },

    title: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.secondary,
        fontSize: 70,
        marginBottom: 10
    },

    subTitle: {
        fontSize: 20,
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.secondary,
        textAlign: 'center',
        marginBottom: 10,
    },

    input: {
        backgroundColor: commonStyles.colors.secondary,
        marginTop: 10,
        borderRadius: 5,
    },
    
    formContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.37)',
        padding: 20,
        width: '88%'
    },

    button: {
        backgroundColor: '#090',
        marginTop: 10,
        padding: 10,
        alignItems: 'center',
        borderRadius: 5
    },

    buttonText: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.secondary,
        fontSize: 20
    }
})

export default Auth;