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
export default class GDCommualHotCell extends Component<Props> {


    static  propTypes={

        image:PropTypes.string,
        title:PropTypes.string,


    }


    render() {
        return (
            <View style={styles.container}>
              {/*左边图片*/}
              <Image source={{uri:this.props.image ===''?'defaullt_thumb_83x83':this.props.image }} style={styles.imageStyle}/>
                {/*中间的文字*/}
                <View>

                    <Text numberOfLines={3} style={styles.titleStyle}>{this.props.title}</Text>
                </View>

                {/*右边的箭头*/}
                <Image
                    source={{uri:'icon_cell_rightArrow'}}
                    style={styles.arrowStyle}
            />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor:'white',
        height:100,
        borderBottomWidth: 0.5,
        borderBottomColor:'gray',
        width:width,
        marginLeft: 15

    },
    imageStyle:{

        width:70,
        height:70,


    },
    arrowStyle:{

    width:10,
        height:10,
        marginRight: 30

    },
    titleStyle:{
        width:width*0.65,


    }
});
