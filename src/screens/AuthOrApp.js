import React, { Component } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import { showError } from '../common';

class AuthOrApp extends Component {

    componentDidMount = async () => {
        const userDataJson = await AsyncStorage.getItem('userData')
            .catch(err => showError(err));

        let userData = null; 
        userData = JSON.parse(userDataJson);

        if (userData && userData.token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
            this.props.navigation.navigate('Home', userData);
        } else {
            this.props.navigation.navigate('Auth');
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000'
    }
})

export default AuthOrApp;