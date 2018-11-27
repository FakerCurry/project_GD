/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Navigator, Image, TouchableOpacity} from 'react-native';

//应用外部文件
import  CommunalNavBar from '../main/GDCommunalNavBar';




type Props = {};
export default class GDHourList extends Component<Props> {



    //返回中间按钮
    renderTitleItem(){
        return(
            <TouchableOpacity>
                <Image source={{uri:'navtitle_rank_106x20'}} style={styles.navbarTitleItemStyle}/>

            </TouchableOpacity>

        );



    }

    //返回右边按钮
    renderRightItem(){

        return(

            <TouchableOpacity>
                <Text style={styles.navbarRightItemStyle}>设置</Text>

            </TouchableOpacity>

        );


    }


    render() {
        return (
            <View style={styles.container}>



                    {/*导航栏样式*/}
                    <CommunalNavBar

                        titleItem={()=>this.renderTitleItem()}
                        rightItem={()=>this.renderRightItem()}
                    />





            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,

        alignItems: 'center',
        backgroundColor: 'yellow',
    },
    navbarTitleItemStyle:{
        width:106,
        height: 20,
        marginLeft: 50
    }

    ,
    navbarRightItemStyle:{
      fontSize:17,
        color:'rgba(123,178,114,1.0)',
        marginRight: 15,
    },
});
