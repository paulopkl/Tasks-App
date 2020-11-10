import React, { Component } from 'react';
import { Text, View, ImageBackground, StyleSheet, FlatList, TouchableOpacity, Platform, Alert } from 'react-native';

import commonStyles from '../commonStyles';

import Icon from 'react-native-vector-icons/FontAwesome';

import todayImage from '../../assets/imgs/today.jpg';

import moment from 'moment';
import 'moment/locale/pt-br';

import Task from '../components/Task';

import AddTask from './AddTask';

class TaskList extends Component {

    state = {
        showDoneTasks: true,
        showAddTask: true,
        visibleTasks: [],
        tasks: [
            { 
                id: Math.random(), 
                desc: 'Buy React-Native Book', 
                estimateAt: new Date(),
                doneAt: new Date(),
            },
            { 
                id: Math.random(), 
                desc: 'Read React-Native Book', 
                estimateAt: new Date(),
                doneAt: null,
            },
            { 
                id: Math.random(), 
                desc: 'Buy React-Native Book', 
                estimateAt: new Date(),
                doneAt: new Date(),
            },
            { 
                id: Math.random(), 
                desc: 'Read React-Native Book', 
                estimateAt: new Date(),
                doneAt: null,
            },
            { 
                id: Math.random(), 
                desc: 'Buy React-Native Book', 
                estimateAt: new Date(),
                doneAt: new Date(),
            },
            { 
                id: Math.random(), 
                desc: 'Read React-Native Book', 
                estimateAt: new Date(),
                doneAt: null,
            },
            { 
                id: Math.random(), 
                desc: 'Buy React-Native Book', 
                estimateAt: new Date(),
                doneAt: new Date(),
            },
            { 
                id: Math.random(), 
                desc: 'Read React-Native Book', 
                estimateAt: new Date(),
                doneAt: null,
            },
            { 
                id: Math.random(), 
                desc: 'Buy React-Native Book', 
                estimateAt: new Date(),
                doneAt: new Date(),
            },
            { 
                id: Math.random(), 
                desc: 'Read React-Native Book', 
                estimateAt: new Date(),
                doneAt: null,
            },
        ]
    }

    componentDidMount() {
        this.filterTasks();
    }

    toogleFilter = () => {
        this.setState({ showDoneTasks: !this.state.showDoneTasks }, this.filterTasks);
    }

    toogleTask = taskId => {
        const tasks = [...this.state.tasks];

        tasks.forEach(task => {
            if(task.id === taskId) { // If tasks.id it's equals to taskId received then
                task.doneAt = task.doneAt ? null : new Date(); // this task.doneAt receive null if defined or new Date()
            }
        });

        this.setState(tasks, this.filterTasks);
    }

    addTask = newTask => {
        if (!newTask.desc || !newTask.desc.trim()) { // 
            Alert.alert('Dados inválidos', 'Descrição não informada!');
            return;
        }

        const tasks = [...this.state.tasks];
        tasks.push({ 
            id: Math.random(), 
            desc: newTask.desc, 
            estimateAt: newTask.date,
            doneAt: null
        });

        this.setState({ tasks, showAddTask: false }, this.filterTasks);
    }

    filterTasks = () => {
        let visibleTasks = null;

        if (this.state.showDoneTasks) {
            visibleTasks = [...this.state.tasks];
        } else {
            visibleTasks = this.state.tasks.filter(task => task.doneAt === null);
        }

        this.setState({ visibleTasks });
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
                <ImageBackground source={todayImage} style={styles.background}>
                    <View style={styles.iconBar}>
                        <TouchableOpacity onPress={this.toogleFilter}>
                            <Icon 
                                name={this.state.showDoneTasks ? 'eye' : 'eye-slash'} 
                                size={20}
                                color={commonStyles.colors.secondary}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.titleBar}>
                        <Text style={styles.title}>Hoje</Text>
                        <Text style={styles.subTitle}>{today}</Text>
                    </View>
                </ImageBackground>
                <View style={styles.taskList}>
                    <FlatList
                        data={this.state.visibleTasks}
                        keyExtractor={item => String(item.id)}
                        renderItem={obj => <Task {...obj.item} toogleTask={this.toogleTask} />}
                    />
                </View>
                <TouchableOpacity 
                    style={styles.addButton} 
                    onPress={() => this.setState({ showAddTask: true })}
                    activeOpacity={0.7}>
                        <Icon name="plus" size={20} color={commonStyles.colors.secondary}/>
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
        justifyContent: 'flex-end',
        marginTop: Platform.OS === 'ios' ? 30 : 10 
    },

    addButton: {
        position: 'absolute',
        right: 30,
        bottom: 30,
        width: 55,
        height: 55,
        borderRadius: 30,
        backgroundColor: commonStyles.colors.today,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default TaskList;