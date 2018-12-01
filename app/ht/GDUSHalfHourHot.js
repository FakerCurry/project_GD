/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
    Platform, StyleSheet, Text, View, FlatList, Image, TouchableOpacity, Dimensions
    , DeviceEventEmitter,InteractionManager
} from 'react-native';


//应用外部文件
import CommunalNavBar from '../main/GDCommunalNavBar';
import CommunalHotCell from '../main/GDCommualHotCell';
import NoDataView from '../main/GDNoData'



//第三方
import {PullView} from 'react-native-pull';
import {RefreshState} from "react-native-refresh-list-view";

import CommunalDetail from '../main/GDCommunalDetail'

const {width, height} = Dimensions.get("window");


type Props = {};
export default class GDUSHalfHourHot extends Component<Props> {


    constructor(props) {
        super(props);

        //初始状态
        this.state = {

            dataSource: [],
            loaded: false,

        };
        //需要绑定
        this.fetchData = this.fetchData.bind(this)
        this.renderItem=this.renderItem.bind(this)
    }

    static defaultProps = {

        removeModal: {}
    }

    //网络请求的方法
    fetchData(resolve) {
        let params={
            "c":"us"
        };

        HTTPBase.get('http://guangdiu.com/api/gethots.php',params)
            .then(responseData => {

                this.setState({
                    // dataSource: this.state.dataSource.concat(responseData.data),
                    dataSource: responseData.data,
                    loaded: true,

                })
                if (resolve !== undefined) {
                    setTimeout(() => {
                        resolve();
                    }, 1000)

                }

            }).done()


    }


    componentWillMount() {
        DeviceEventEmitter.emit('isHiddenTabBar', true);
    }


    componentDidMount() {
        this.fetchData();
    }

    componentWillUnmount() {

        DeviceEventEmitter.emit('isHiddenTabBar', false);

    }

    // onPullRelease(resolve) {
    //     //do something
    //     setTimeout(() => {
    //         resolve();
    //     }, 3000);
    // }


    //判断是否有数据
    renderFlatView() {

        if (this.state.loaded === false) {

            return (

                <NoDataView/>
            )


        } else {
            return (
                <PullView onPullRelease={(resolve) => this.fetchData(resolve)}>


                    <FlatList
                        data={
                            this.state.dataSource

                        }

                        renderItem={this.renderItem}
                        keyExtractor={(item, index) => index.toString()}

                        showsHorizontalScrollIndicator={false}

                        style={styles.flatlistStyle}
                        ListHeaderComponent={this.renderHeaderView}

                    />
                </PullView>
            );

        }

    }

    //返回flatView的头部
    renderHeaderView() {


        return (

            <View style={styles.headerPromptStyle}>
                <Text>根据每条折扣的点击进行统计，每6分钟更新一次</Text>

            </View>
        );

    }


    //返回中间按钮
    renderTitleItem() {
        return (
            <View style={styles.navbarTitleItemStyle}>

                <Text>近半小时热门</Text>
            </View>

        );


    }


    //跳转到详情页
    pushToDetail(value){

        InteractionManager.runAfterInteractions(()=>{
            this.props.navigator.push({


                component:CommunalDetail,
                params:{
                    url:'https://guangdiu.com/api/showdetail.php'+'?'+'id='+ value
                }
            })

        })


    }

    popToHome(data) {

        // this.props.navigator.pop();
        this.props.removeModal(data)

    }

    //返回右边按钮
    renderRightItem() {

        return (

            <TouchableOpacity onPress={() => {
                this.popToHome(false)
            }}>
                <Text style={styles.navbarRightItemStyle}>关闭</Text>

            </TouchableOpacity>

        );


    }

    //返回每一行cell的样式
    renderItem({item}) {
        return (


            <TouchableOpacity
                onPress={() => this.pushToDetail(item.id)}
            >
                <CommunalHotCell
                    image={item.image}
                    //测试展位图
                    // image=''
                    title={item.title}
                />

            </TouchableOpacity>

        );


    }


    render() {
        return (
            <View style={styles.container}>

                {/*导航栏样式*/}
                <CommunalNavBar

                    titleItem={() => this.renderTitleItem()}
                    rightItem={() => this.renderRightItem()}
                />


                {/*根据网络状态局部渲染FlatView*/}
                {this.renderFlatView()}


            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',

    },
    navbarLeftItemStyle: {
        width: 20,
        height: 20,
        marginLeft: 15,


    },
    navbarTitleItemStyle: {
        fontSize: 17,
        color: 'black',
        marginLeft: 50

    }

    ,
    navbarRightItemStyle: {
        fontSize: 17,
        color: 'rgba(123,178,114,1.0)',
        marginRight: 15
    },
    flatlistStyle: {
        width: width,


    },
    headerPromptStyle: {

        height: 44,
        width: width,
        backgroundColor: 'rgba(239,239,239,0.5)',
        justifyContent: 'center',
        alignItems: 'center'
    }
});
