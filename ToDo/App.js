/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';

import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import ListTaskScreen from './Controller/ListTaskScreen'
import AddTaskScreen from './Controller/AddTaskScreen'

const mystack = createStackNavigator({
	Main: { screen: ListTaskScreen },
	
	AddTaskScreen: { screen: AddTaskScreen }
});

const AppContainer = createAppContainer(mystack);
export default AppContainer;