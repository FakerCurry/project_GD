/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import {Navigator} from 'react-native-deprecated-custom-components';
const instructions = Platform.select({
    ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
    android:
        'Double tap R on your keyboard to reload,\n' +
        'Shake or press menu button for dev menu',
});


import Main from './app/main/GDMain';

import LaunchPage from './app/main/GDLaunchPage'


import HTTPBase from './app/http/HTTPBase';

import RealmStorage from './app/storage/realmStorage';


type Props = {};
export default class App extends Component<Props> {
    render() {
        return (

            <Navigator
                initialRoute={{

                    name: 'launchPage',
                    component: LaunchPage
                }}

                renderScene={(route, navigator) => {

                    let Component = route.component;

                    return <Component {...route.params} navigator={navigator}/>


                }}
            />


        );
    }
}
