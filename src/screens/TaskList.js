import React, { Component } from 'react';
import { Text, View, ImageBackground, StyleSheet, FlatList, TouchableOpacity, Platform, Alert } from 'react-native';

import commonStyles from '../commonStyles';

import Icon from 'react-native-vector-icons/FontAwesome';

import todayImage from '../../assets/imgs/today.jpg';
import tomorrowImage from '../../assets/imgs/tomorrow.jpg';
import weekImage from '../../assets/imgs/week.jpg';
import monthImage from '../../assets/imgs/month.jpg';

import moment from 'moment';
import 'moment/locale/pt-br';

import Task from '../components/Task';

import AddTask from './AddTask';
import AsyncStorage from '@react-native-community/async-storage';

import axios from 'axios';
import { server, showError, showSuccess } from '../common';

const initialState = { 
    showDoneTasks: true,
    showAddTask: true,
    visibleTasks: [],
    tasks: [], 
    // tasks: [
    //     { 
    //         id: Math.random(), 
    //         desc: 'Buy React-Native Book', 
    //         estimateAt: new Date(),
    //         doneAt: new Date(),
    //     },
    //     { 
    //         id: Math.random(), 
    //         desc: 'Read React-Native Book', 
    //         estimateAt: new Date(),
    //         doneAt: null,
    //     }
    // ]
};

class TaskList extends Component {

    state = initialState;

    componentDidMount = async () => {
        const stateString = await AsyncStorage.getItem('tasksState');
        const savedState = JSON.parse(stateString) || initialState;
        this.setState({
            showDoneTasks: savedState.showDoneTasks,
        }, this.filterTasks);

        this.loadTasks();
    }

    toogleFilter = () => {
        this.setState({ showDoneTasks: !this.state.showDoneTasks }, this.filterTasks);
    }

    toogleTask = async taskId => {
        // const tasks = [...this.state.tasks];

        // tasks.forEach(task => {
        //     if(task.id === taskId) { // If tasks.id it's equals to taskId received then
        //         task.doneAt = task.doneAt ? null : new Date(); // this task.doneAt receive null if defined or new Date()
        //     }
        // });

        // this.setState(tasks, this.filterTasks);

        await axios.put(`${server}/tasks/${taskId}/toogle`)
            .catch(err => showError(err));
        this.loadTasks();
    }

    addTask = async newTask => {
        if (!newTask.desc || !newTask.desc.trim()) { // 
            Alert.alert('Dados inválidos', 'Descrição não informada!');
            return;
        }

        // const tasks = [...this.state.tasks];
        // tasks.push({ 
        //     id: Math.random(), 
        //     desc: newTask.desc, 
        //     estimateAt: newTask.date,
        //     doneAt: null
        // });

        // this.setState({ tasks, showAddTask: false }, this.filterTasks);

        const data = {
            desc: newTask.desc,
            estimateAt: newTask.date,
        }

        await axios.post(`${server}/tasks`, data)
            .then(res => {
                showSuccess(res)
            })
            .catch(err => {
                showError(err)
            });

        this.setState({ showAddTask: false }, this.loadTasks);
    }

    loadTasks = async () => {
        const maxDate = moment().add({ days: this.props.daysAhead }).format('YYYY-MM-DD 23:59:59');
        console.log(maxDate);
        await axios.get(`${server}/tasks?date=${maxDate}`)
            .then(res => {
                this.setState({ tasks: res.data }, this.filterTasks);
            })
            .catch(err => {
                showError(err);
            });
    }

    filterTasks = () => {
        let visibleTasks = null;

        if (this.state.showDoneTasks) {
            visibleTasks = [...this.state.tasks];
        } else {
            visibleTasks = this.state.tasks.filter(task => task.doneAt === null);
        }

        this.setState({ visibleTasks });
        AsyncStorage.setItem('tasksState', JSON.stringify(this.state)); // Clones the state on the device
    }

    deleteTask = async taskId => {
        // const tasks = this.state.tasks.filter(task => {
        //     return task.id !== id;
        // });

        // this.setState({ tasks }, this.filterTasks);

        await axios.delete(`${server}/tasks/${taskId}`)
            .catch(err => showError(err));
        this.loadTasks();

    }

    getImage = () => {
        switch (this.props.daysAhead) {
            case 0: { return todayImage }
            case 1: { return tomorrowImage }
            case 7: { return weekImage }
            default: { return monthImage }
        }
    }

    getColor = () => {
        switch (this.props.daysAhead) {
            case 0: { return commonStyles.colors.today }
            case 1: { return commonStyles.colors.tomorrow }
            case 7: { return commonStyles.colors.week }
            default: { return commonStyles.colors.month }
        }
    }

    render() {
        const today = moment().locale('pt-br').format('ddd, D [de] MMMM');
        return (
            <View style={styles.container}>
                <AddTask 
                    onCancel={() => this.setState({ showAddTask: false })} 
                    isVisible={this.state.showAddTask}
                    onSave={this.addTask}
                />
                <ImageBackground source={this.getImage()} style={styles.background}>
                    <View style={styles.iconBar}>
                        <TouchableOpacity onPress={() => this.props.navigation.openDrawer()}>
                            <Icon name="bars" size={20} color={commonStyles.colors.secondary} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.toogleFilter}>
                            <Icon 
                                name={this.state.showDoneTasks ? 'eye' : 'eye-slash'} 
                                size={20}
                                color={commonStyles.colors.secondary}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.titleBar}>
                        <Text style={styles.title}>{this.props.title}</Text>
                        <Text style={styles.subTitle}>{today}</Text>
                    </View>
                </ImageBackground>
                <View style={styles.taskList}>
                    <FlatList
                        data={this.state.visibleTasks}
                        keyExtractor={item => String(item.id)}
                        renderItem={obj => <Task {...obj.item} 
                            onToogleTask={this.toogleTask} 
                            onDelete={this.deleteTask} 
                        />}
                    />
                </View>
                <TouchableOpacity 
                    style={[styles.addButton, { backgroundColor: this.getColor() }]}
                    onPress={() => this.setState({ showAddTask: true })}
                    activeOpacity={0.7}>
                        <Icon name="plus" size={20} color={commonStyles.colors.secondary} />
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    background: {
        flex: 3
    },

    taskList: {
        flex: 7
    },

    titleBar: {
        flex: 1,
        justifyContent: 'flex-end'
    },

    title: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.secondary,
        fontSize: 50,
        marginLeft: 20,
        marginBottom: 20
    },

    subTitle: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.secondary,
        fontSize: 20,
        marginLeft: 20,
        marginBottom: 30
    },

    iconBar: {
        flexDirection: 'row',
        marginHorizontal: 20,
        justifyContent: 'space-between',
        marginTop: Platform.OS === 'ios' ? 30 : 10 
    },

    addButton: {
        position: 'absolute',
        right: 30,
        bottom: 30,
        width: 55,
        height: 55,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default TaskList;