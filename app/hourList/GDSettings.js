/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
    Image, Platform, StyleSheet, Text, TouchableOpacity, View,
    ScrollView, DeviceEventEmitter, BackHandler
} from 'react-native';

import PropTypes from 'prop-types';
//应用外部文件
import CommunalNavBar from '../main/GDCommunalNavBar';

import SettingsCell from './GDSettingsCell';


type Props = {};
export default class GDSettings extends Component<Props> {



    componentWillMount() {
        DeviceEventEmitter.emit('isHiddenTabBar', true);

        if (Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress', this.onBackHandler);
        }
    }



    componentWillUnmount() {

        DeviceEventEmitter.emit('isHiddenTabBar', false);

        if (Platform.OS === 'android') {
            BackHandler.removeEventListener('hardwareBackPress', this.onBackHandler);
        }

    }





    onBackHandler = () => {

        this.pop();
        return true;
    };



    pop() {


        this.props.navigator.pop();
    }


    //返回左边按钮
    renderLeftItem() {

        return (


            <TouchableOpacity onPress={() => {
                this.pop()
            }}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image source={{uri: 'back'}} style={styles.navbarLeftItemStyle}/>

                    <Text>返回</Text>
                </View>


            </TouchableOpacity>


        );


    }


    //返回中间按钮
    renderTitleItem() {
        return (
            <TouchableOpacity

            >
                <Text style={{marginRight: 15,fontSize:17}}>设置</Text>

            </TouchableOpacity>

        );


    }


    render() {
        return (

            <View style={styles.container}>
                {/*导航栏样式*/}
                <CommunalNavBar
                    leftItem={() => this.renderLeftItem()}
                    titleItem={() => this.renderTitleItem()}

                />

                {/*内容*/}

                <ScrollView style={styles.scrollViewStyle}>

                    <SettingsCell leftTitle="淘宝天猫快捷下单"
                                  isShowSwitch={true}/>
                    <SettingsCell leftTitle="清理图片缓存"
                                  isShowSwitch={false}/>





                </ScrollView>
            </View>


        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    scrollViewStyle: {

        backgroundColor: 'white',

    }, navbarLeftItemStyle: {
        width: 20,
        height: 20,
        marginLeft: 15,


    }
});