/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    View,
    Image,
    TouchableOpacity,
    FlatList,
    Dimensions,
    ActivityIndicator,
    Alert,
    RefreshControl,
    Modal,
    AsyncStorage
} from 'react-native';

//第三方
import {PullView} from 'react-native-pull';


//https://blog.csdn.net/s8460049/article/details/73331043
import {Navigator} from 'react-native-deprecated-custom-components';
// import RefreshListView, { RefreshState } from 'react-native-refresh-list-view'

import RefreshListView, {RefreshState} from '../tools/RefreshListView'


//应用外部文件
import CommunalNavBar from '../main/GDCommunalNavBar';
import CommunalDetail from '../main/GDCommunalDetail'
import USHalfHourHot from './GDUSHalfHourHot'

import Search from '../main/GDSearch'
import NoDataView from "../main/GDNoData";

import CommunalHotCell from "../main/GDCommualHotCell";
import HTTPBase from '../http/HTTPBase'


const {width, height} = Dimensions.get("window");

type Props = {};
export default class GDHt extends Component<Props> {


    constructor(props) {
        super(props);

        //初始状态
        this.state = {

            dataSource: [],
            loaded: false,
            refreshState: RefreshState.Idle,
            isRefreshing: false,
            isModal: false

        };

        this.data=[]

        //需要绑定
        this.fetchData = this.fetchData.bind(this)
        this.renderItem=this.renderItem.bind(this)
    }

    //网络请求的方法
    //type 0:普通请求    1：下拉刷新   2：上拉加载
    fetchData(type) {
        let params ;
        if (type === 2) {
            //读取存储的id
            AsyncStorage.getItem('lastID')
                .then((value) => {


                    params={"count": 10,"sinceid":value,"country":"us"};

                })


        }else {
            params={"count": 10,"country":"us"};

        }




        HTTPBase.post('http://guangdiu.com/api/getlist.php', params, {})
            .then(responseData => {


                if (type === 0) {
                    this.data=responseData.data;

                    this.setState({

                        dataSource: this.data,
                        loaded: true

                    })

                } else if (type === 1) {

                    this.data=responseData.data;


                    this.setState({
                        dataSource: this.data,
                        isRefreshing: false,
                        loaded: true
                    })

                } else {

                    // let result = this.state.dataSource;
                    // for (var i = 0; i < responseData.data.length; i++) {
                    //
                    //     result.push(responseData.data[i]);
                    //
                    // }
                    //拼接数组
                    this.data=this.data.concat(responseData.data);


                    this.setState({
                        dataSource: this.data,
                        refreshState: responseData.data.length < 1 ? RefreshState.NoMoreData : RefreshState.Idle,
                        loaded: true
                    })

                }


                //存储数组中最后一个元素的id
                let lastID = responseData.data[responseData.data.length - 1].id

                AsyncStorage.setItem('lastID', lastID.toString());
                // Alert.alert(lastID.toString())


            }).catch((error) => {


        }).done()


    }


    componentDidMount() {
        var type = 0;
        this.fetchData(type);

    }


    onHeaderRefresh = () => {
        // this.setState({ refreshState: RefreshState.HeaderRefreshing
        // })

        this.setState({

            isRefreshing: true,

        })

        // 模拟网络请求
        setTimeout(() => {
            var type = 1;
            this.fetchData(type);

            // this.setState({
            //     dataList: dataList,
            //     refreshState: dataList.length < 1 ? RefreshState.EmptyData : RefreshState.Idle,
            // })
        }, 2000)
    }

    onFooterRefresh = () => {
        this.setState({refreshState: RefreshState.FooterRefreshing})

        // 模拟网络请求
        setTimeout(() => {
            var type = 2;
            this.fetchData(type);

            // this.setState({
            //     dataList: dataList,
            //     refreshState: dataList.length > 50 ? RefreshState.NoMoreData : RefreshState.Idle,
            // })
        }, 2000)
    }


    //判断是否有数据
    renderFlatView() {

        if (this.state.loaded === false) {

            return (

                <NoDataView/>
            )


        } else {
            return (


                <RefreshListView
                    data={this.state.dataSource}
                    keyExtractor={this.keyExtractor}
                    renderItem={this.renderItem}
                    refreshState={this.state.refreshState}
                    // onHeaderRefresh={this.onHeaderRefresh}
                    onFooterRefresh={this.onFooterRefresh}
                    keyExtractor={(item, index) => index.toString()}
                    showsHorizontalScrollIndicator={false}
                    // 可选
                    footerRefreshingText='玩命加载中 >.<'
                    footerFailureText='我擦嘞，居然失败了 =.=!'
                    footerNoMoreDataText='-我是有底线的-'
                    footerEmptyDataText='-好像什么东西都没有-'

                    style={styles.flatlistStyle}

                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isRefreshing}
                            onRefresh={() => {
                                this.onHeaderRefresh()
                            }
                            }
                            tintColor="#ff0000"
                            title="正在加载..."
                            titleColor="#00ff00"
                            colors={['#ff0000', '#00ff00', '#0000ff']}
                            progressBackgroundColor="#ffff00"/>

                    }
                />

            );

        }

    }

    //跳转到详情页
    pushToDetail(value){

        this.props.navigator.push({


            component:CommunalDetail,
            params:{
                url:'https://guangdiu.com/api/showdetail.php'+'?'+'id='+ value
            }
        })
    }


    //返回每一行cell的样式
    renderItem({item}) {


        return (

            <TouchableOpacity
                onPress={()=>this.pushToDetail(item.id)}
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


//跳转到半个小时热门
    pushToHalfHourHot() {

        // this.props.navigator.push({
        //     component: HalfHourHot,
        //     animationType: Navigator.SceneConfigs.FloatFromBottom
        // })

        this.setState({

            isModal: true
        })
    }

    //返回左边按钮
    renderLeftItem() {

        return (

            <TouchableOpacity onPress={() => {
                this.pushToHalfHourHot()
            }}>
                <Image source={{uri: 'hot_icon_20x20'}} style={styles.navbarLeftItemStyle}/>

            </TouchableOpacity>

        );


    }



    //返回中间按钮
    renderTitleItem() {
        return (
            <TouchableOpacity

            >
                <Image source={{uri: 'navtitle_home_down_66x20'}} style={styles.navbarTitleItemStyle}/>

            </TouchableOpacity>

        );


    }


    //返回右边按钮
    renderRightItem() {

        return (

            <TouchableOpacity onPress={() => this.pushToSearch()}>
                <Image source={{uri: 'search_icon_20x20'}} style={styles.navbarRightItemStyle}/>

            </TouchableOpacity>

        );


    }


    pushToSearch() {
        this.props.navigator.push({

            component: Search,

        })


    }

    onRequestClose() {

        this.setState({
            isModal: false

        })

    }

    closeModal(data) {
        this.setState({
            isModal: false

        })

    }

    // 模态跳转
    render() {
        return (
            <View style={styles.container}>

                {/*初始化模态*/}
                <Modal animationType='slide'
                       transparent={false}
                       visible={this.state.isModal}
                       onRequestClose={() => this.onRequestClose()}>
                    <Navigator
                        initialRoute={{
                            name:'usHalfHourHot',
                            component:USHalfHourHot


                        }}

                        renderScene={(route,navigator)=>{

                            let Component = route.component;
                            return   <Component removeModal={(data) => this.closeModal(data)}
                                                {...route.params} navigator={navigator}/>
                        }}
                    />



                </Modal>
                {/*导航栏样式*/}
                <CommunalNavBar
                    leftItem={() => this.renderLeftItem()}
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
        backgroundColor: 'white',
    },
    navbarLeftItemStyle: {
        width: 20,
        height: 20,
        marginLeft: 15,


    },
    navbarTitleItemStyle: {
        width: 66,
        height: 20
    }

    ,
    navbarRightItemStyle: {
        width: 20,
        height: 20,
        marginRight: 15,
    },
    flatlistStyle: {
        width: width,


    }
});


