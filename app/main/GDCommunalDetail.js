/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {StyleSheet, Text, View,Dimensions,WebView,TouchableOpacity, DeviceEventEmitter} from 'react-native';

import PropTypes from 'prop-types';
const  {width, height} =Dimensions.get('window');

//引入外部文件
import  GDCommunalNavBar from './GDCommunalNavBar'




type Props = {};
export default class GDCommualHotCell extends Component<Props> {


    static  propTypes={
        
        url: PropTypes.string,


    }

    //返回
    popBack(){
        
        this.props.navigator.pop();
        
    }
    

//返回左边按钮
    renderLeftItem() {

        return (

            <TouchableOpacity
                onPress={()=>this.popBack()}
            >
                <Text>返回</Text>
            </TouchableOpacity>

        );

    }


    componentWillMount() {
        DeviceEventEmitter.emit('isHiddenTabBar', true);
    }



    componentWillUnmount() {

        DeviceEventEmitter.emit('isHiddenTabBar', false);

    }



    render() {
        return (
            <View style={styles.container}>

                {/*导航蓝*/}
                <GDCommunalNavBar

                    leftItem={()=>this.renderLeftItem()}
                />


                {/*初始化weiview*/}

                <WebView source={{uri:this.props.url,method:'GET'}}
                         javaScriptEnabled={true}
                         domStorageEnabled={true}
                         scalesPageToFit={false}
                />

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1

    },
    webViewStyle:{
        flex:1
    }
});
