/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    WebView,
    TouchableOpacity,
    DeviceEventEmitter,
    Image,
    Platform, BackHandler
} from 'react-native';

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
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image source={{uri: 'back'}} style={styles.navbarLeftItemStyle}/>

                    <Text>返回</Text>
                </View>
            </TouchableOpacity>

        );

    }


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

        this.props.navigator.pop();
        return true;
    };



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
    },
    navbarLeftItemStyle: {
        width: 20,
        height: 20,
        marginLeft: 15,


    }
});
