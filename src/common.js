import { Alert, Platform } from 'react-native';

const server = Platform.OS === 'ios' ? 'http://localhost:3333' : 'http://10.0.2.2:3333';

const showError = err => {
    console.log(err.message);
    if (err.response && err.response.data) {
        Alert.alert('Ops! There was a Problem', `Message: ${err.response.data}`);
        // Alert.alert('Ops! There was a Problem', `Message: ${Object.values(err)}`);
    } else {
        Alert.alert('Ops! There was a Problem', `Message: ${err}`);
    }
}

const showSuccess = msg => {
    Alert.alert('Success!', msg);
}

export { showError, showSuccess, server };