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
    ScrollView, DeviceEventEmitter, Dimensions,
    FlatList, Alert
} from 'react-native';

import PropTypes from 'prop-types';


const {width, height} = Dimensions.get("window");


type Props = {};
export default class GDSettings extends Component<Props> {


    static defaultProps = {

        removeModal: {},
        loadByMall:{}

    }
    static propTypes = {


        data: PropTypes.array,


    }


    constructor(props) {
        super(props);
        this.state = {

            dataSource: [],
        }

        this.renderRow=this.renderRow.bind(this)

    }

    componentDidMount() {
        this.loadData();
    }


    popToHome(data) {

        // this.props.navigator.pop();
        this.props.removeModal(data)

    }


    //点击时间
    siftData(mall,cate){

        this.props.loadByMall(mall,cate);
        this.popToHome(false);
    }



    //处理数据
    loadData() {

        let data = [];
        for (let i = 0; i < this.props.data.length; i++) {

            data.push(this.props.data[i]);


        }

        //重新渲染
        this.setState({
            dataSource: data

        })


    }

    renderRow({item}) {


        return (

            <View style={styles.itemViewStyle}>


                <TouchableOpacity onPress={()=>{
                    this.siftData(item.mall,item.cate)
                }}>


                    <View style={{justifyContent: 'center',
                        alignItems: 'center'}}>
                        <Image source={{uri: item.image}} style={styles.itemImageStyle}/>
                        <Text style={{textAlign:'center'}}>{item.title}</Text>

                    </View>


                </TouchableOpacity>

            </View>


        )

    }


    render() {
        return (


            <TouchableOpacity
                onPress={() => {

                    this.popToHome(false)
                }}
                activeOpacity={1}
            >
                <View style={styles.container}>

                    {/*内容
                     contentContainerStyle={styles.contentViewStyle}*/}

                    <FlatList

                        data={this.state.dataSource}
                        renderItem={this.renderRow}

                        numColumns={4}
                        horizontal={false}
                        keyExtractor={(item, index) => index.toString()}
                        contentContainerStyle={styles.contentViewStyle}

                    />
                </View>
            </TouchableOpacity>


        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: width,
        height: height

    },
    itemViewStyle: {
        width: width * 0.25,
        height: 70,
        backgroundColor: 'rgba(249,249,249,1.0 )',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'


    },
    itemImageStyle: {

        width: 40,
        height: 40


    },
    contentViewStyle: {

        // flexDirection: 'row',
        // flexWrap: 'wrap',
        width: width,
        // justifyContent: 'space-between',

        // 侧轴方向
        // alignItems:'center', // 必须设置,否则换行不起作用

        top: Platform.OS === 'ios' ? 64 : 44


    }
});