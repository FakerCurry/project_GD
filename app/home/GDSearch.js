/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Navigator, Image, TouchableOpacity} from 'react-native';

import PropTypes from 'prop-types';

//应用外部文件
import  CommunalNavBar from '../main/GDCommunalNavBar';


type Props = {};
export default class GDSearch extends Component<Props> {

    static defaultPropas={

        name:'xiaoshui',
    }

    static propTypes={

        name:PropTypes.string,
        ID:PropTypes.number.isRequired,


    }



//返回左边按钮
    renderLeftItem(){

        return(

            <TouchableOpacity>
                <Image source={{uri:'hot_icon_20x20'}} style={styles.navbarLeftItemStyle}/>

            </TouchableOpacity>

        );



    }
    //返回中间按钮
    renderTitleItem(){
        return(
            <TouchableOpacity>
                <Image source={{uri:'navtitle_abroad_down_66x20'}} style={styles.navbarTitleItemStyle}/>

            </TouchableOpacity>

        );



    }




    //返回右边按钮
    renderRightItem(){

        return(

            <TouchableOpacity>
                <Image source={{uri:'search_icon_20x20'}} style={styles.navbarRightItemStyle}/>

            </TouchableOpacity>

        );


    }

    render() {
        return (
            <View style={styles.container}>

                {/*导航栏样式*/}
                <CommunalNavBar
                    leftItem={()=>this.renderLeftItem()}
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
        backgroundColor: 'red',
    },
    navbarLeftItemStyle:{
        width: 20,
        height: 20,
        marginLeft: 15,


    },
    navbarTitleItemStyle:{
        width: 66,
        height: 20
    }

    ,
    navbarRightItemStyle:{
        width:20,
        height:20,
        marginRight: 15,
    },
});
