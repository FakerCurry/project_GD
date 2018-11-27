/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View,Navigator, Image,Dimensions} from 'react-native';

import PropTypes from 'prop-types';

const  {width, height} =Dimensions.get('window');


type Props = {};
export default class GDCommunalNavBar extends Component<Props> {

    static propTypes={
        leftItem:PropTypes.func,
        titleItem:PropTypes.func,
        rightItem:PropTypes.func,
    };



//左边
    renderLeftItem(){
        if (this.props.leftItem===undefined)return;
        return this.props.leftItem();

    }
    // 中间
    renderTitleItem(){

        if (this.props.titleItem==undefined)return;
        return this.props.titleItem();

    }

    // youbian
    renderRightItem(){

        if (this.props.rightItem==undefined)return;
        return this.props.rightItem();

    }



    render() {
        return (
            <View style={styles.container}>
               {/*左边*/}
               <View>
                   {this.renderLeftItem()}
               </View>
                {/*中间*/}
                <View>
                    {this.renderTitleItem()}

                </View>
                {/*右边*/}

                <View>

                    {this.renderRightItem()}


                </View>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {

        width:width,
        height:Platform.OS==='ios' ? 64 : 44,
        backgroundColor:'white',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 0.5,
        borderBottomColor:'gray',
        paddingTop: Platform.OS ==='ios'?15:0,
    }
});
