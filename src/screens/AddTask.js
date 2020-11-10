import React, { Component } from 'react';
import { View, Text, Modal, StyleSheet, TouchableWithoutFeedback, TextInput, TouchableOpacity, Platform 
    } from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';

import moment from 'moment';
import 'moment/locale/pt-br';



import commonStyles from '../commonStyles';

const initialState = { desc: '', date: new Date(), showDatePicker: false };

class AddTask extends Component {

    state = { ...initialState }

    save = () => {
        const newTask = { desc: this.state.desc, date: this.state.date }

        this.props.onSave && this.props.onSave(newTask); // If props.onSave exists then
        this.setState(initialState);
    }

    getDatePicker = () => {
        let datePicker = <DateTimePicker 
            value={this.state.date} 
            onChange={(_, date) => this.setState({ date, showDatePicker: false })}
            mode="date" 
        />

        const dateString = moment(this.state.date).format('ddd, D [de] MMMM [de] YYYY');

        if (Platform.OS === 'android') {
            datePicker = (
                <View>
                    <TouchableOpacity onPress={() => this.setState({ showDatePicker: true })}>
                        <Text style={styles.date}>
                            {dateString}
                        </Text>
                    </TouchableOpacity>
                    {this.state.showDatePicker && datePicker}
                </View>
            );
        }

        return datePicker;
    }

    render() {
        return (
            <Modal transparent={true} visible={this.props.isVisible} onRequestClose={this.props.onCancel}
                animationType="slide">
                    <TouchableWithoutFeedback onPress={this.props.onCancel}>
                        <View style={styles.background}>

                        </View>
                    </TouchableWithoutFeedback>
                    <View style={styles.container}>
                        <Text style={styles.header}>Nova tarefa</Text>
                        <TextInput 
                            style={styles.input} 
                            placeholder="Informe a Descrição..." 
                            value={this.state.desc}
                            onChangeText={text => this.setState({ desc: text })}
                        />
                        {this.getDatePicker()}
                        <View style={styles.bottons}>
                            <TouchableOpacity onPress={this.props.onCancel}>
                                <Text style={styles.botton}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this.save}>
                                <Text style={styles.botton}>Salvar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <TouchableWithoutFeedback onPress={this.props.onCancel}>
                        <View style={styles.background}>

                        </View>
                    </TouchableWithoutFeedback>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)'
    },

    container: {
        backgroundColor: '#fff'
    },

    header: {
        fontFamily: commonStyles.fontFamily,
        backgroundColor: commonStyles.colors.today,
        color: commonStyles.colors.secondary,
        textAlign: 'center',
        padding: 15,
        fontSize: 18
    },
    
    input: {
        fontFamily: commonStyles.fontFamily,
        height: 40,
        margin: 15,
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#e3e3e3',
        borderRadius: 6
    },

    bottons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',

    },

    botton: {
        margin: 20,
        marginRight: 30,
        color: commonStyles.colors.today
    },

    date: {
        fontFamily: commonStyles.fontFamily,
        fontSize: 20,
        marginLeft: 15,
    }
})

export default AddTask;