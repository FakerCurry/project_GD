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
    AsyncStorage, DeviceEventEmitter
    ,InteractionManager
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


import CommunalCell from "../main/GDCommunalCell";
import CommunalSiftMenu from "../main/GDCommunalSiftMenu";
import HTSiftData from "../data/HTSiftData";
import HalfHourHot from "../home/GDHalfHourHot";
import PropTypes from 'prop-types';

const {width, height} = Dimensions.get("window");

type Props = {};
export default class GDHt extends Component<Props> {

    static  defaultProps={

        loadDatanumber:{

        }


    }
    constructor(props) {
        super(props);

        //初始状态
        this.state = {

            dataSource: [],
            loaded: false,
            refreshState: RefreshState.Idle,
            isRefreshing: false,
            isHalfHourHotModal:false,
            isUSSiftModal:false,

        };

        this.data=[]
        this.list=null;
        this.offSet=0

        //需要绑定
        this.fetchData = this.fetchData.bind(this)
        this.renderItem=this.renderItem.bind(this)
        this._onScroll=this._onScroll.bind(this)
    }



    //获取最新数据个数
    loadDatanumber(){

        this.props.loadDatanumber();

    }

    //网络请求的方法
    //type 0:普通请求    1：下拉刷新   2：上拉加载
    fetchData(type) {
        let params ;
        if (type === 2) {
            //读取存储的id
            AsyncStorage.getItem('uslastID')
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

                    //保存第0个
                    let usfirstID = responseData.data[0].id;

                    AsyncStorage.setItem('usfirstID', usfirstID.toString());

                    //先清空所有数据
                    RealmBase.removeAllData('HTData');
                    //存储数据到本地
                    RealmBase.create('HTData',responseData.data);

                } else if (type === 1) {

                    this.data=responseData.data;


                    this.setState({
                        dataSource: this.data,
                        isRefreshing: false,
                        loaded: true
                    })

                    //保存第0个
                    let usfirstID = responseData.data[0].id;

                    AsyncStorage.setItem('usfirstID', usfirstID.toString());

                    //先清空所有数据
                    RealmBase.removeAllData('HTData')
                    //存储数据到本地
                    RealmBase.create('HTData',responseData.data);

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


                //上啦加载不需要更新角标
                if (type!==2){
                    //获取最新数据的个数
                    this.loadDatanumber();

                }

                //存储数组中最后一个元素的id
                let uslastID = responseData.data[responseData.data.length - 1].id

                AsyncStorage.setItem('uslastID', uslastID.toString());
                // Alert.alert(lastID.toString())


            }).catch((error) => {

                if (type!==2){
                    //拿到本地存储的数据，展示出来，如果没有存储，那就显示无数据页面

                    this.data = RealmBase.loadAll('HTData');
                    this.setState({

                        dataSource: this.data,
                        loaded: true

                    })

                }

        }).done()


    }




    //mall 商城
    loadByMall(mall,cate) {
        let params={} ;

        if (mall===""&&cate===""){//全部

            let type=0;
            this.fetchData(type)
            return;
        }


        if (mall===""){  //cate优质

            params={

                "cate":cate
                ,"country":"us"
            };
        }else {

            params={
                "mall":mall
                ,"country":"us"

            }
        }



        HTTPBase.post('http://guangdiu.com/api/getlist.php', params)
            .then(responseData => {






                this.data=responseData.data;

                this.setState({

                    dataSource: this.data,
                    loaded: true

                })






                //存储数组中最后一个元素的id
                let uslastID = responseData.data[responseData.data.length - 1].id;

                AsyncStorage.setItem('uslastID', uslastID.toString());







            }).catch((error) => {



        }).done()


    }


    clickTabBarItem(){



        if (this.offSet>0){
            //一见置顶
            this.list.scrollToIndex({ viewPosition: 0, index: 0 });

        } else {


            this.onHeaderRefresh()
        }


    }

    componentDidMount() {
        var type = 0;
        this.fetchData(type);

        this.subscription=DeviceEventEmitter.addListener('clickHTItem',()=>{

            this.clickTabBarItem()
        } )

    }

    componentWillUnmount() {
        this.subscription.remove();
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


    _onScroll=(event)=> {

        this.offSet = event.nativeEvent.contentOffset.y;
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
                    listRef={(ref)=>this.list=ref}
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
                    onScroll={this._onScroll}
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

        InteractionManager.runAfterInteractions(()=>{
            this.props.navigator.push({


                component:CommunalDetail,
                params:{
                    url:'https://guangdiu.com/api/showdetail.php'+'?'+'id='+ value
                }
            })

        })


    }


    //返回每一行cell的样式
    renderItem({item}) {


        return (

            <TouchableOpacity
                onPress={()=>this.pushToDetail(item.id)}
            >
                <CommunalCell
                    image={item.image}
                    //测试展位图
                    // image=''
                    title={item.title}
                    mall={item.mall}
                    pubTime={item.pubtime}
                    fromSite={item.fromsite}

                />
            </TouchableOpacity>



        );


    }
    showSiftMenu() {

        this.setState({

            isUSSiftModal:true,

        })
    }

//跳转到半个小时热门
    pushToHalfHourHot() {

        // this.props.navigator.push({
        //     component: HalfHourHot,
        //     animationType: Navigator.SceneConfigs.FloatFromBottom
        // })

        this.setState({

            isHalfHourHotModal: true
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
                onPress={() => {
                    this.showSiftMenu()

                }}
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
            isHalfHourHotModal:false,
            isUSSiftModal:false,

        })

    }

    closeModal(data) {
        this.setState({
            isHalfHourHotModal:data,
            isUSSiftModal:data,

        })

    }

    // 模态跳转
    render() {
        return (
            <View style={styles.container}>



                {/*导航栏样式*/}
                <CommunalNavBar
                    leftItem={() => this.renderLeftItem()}
                    titleItem={() => this.renderTitleItem()}
                    rightItem={() => this.renderRightItem()}
                />
                {/*根据网络状态局部渲染FlatView*/}
                {this.renderFlatView()}

                {/*初始化模态*/}
                <Modal animationType='slide'
                       transparent={false}
                       visible={this.state.isHalfHourHotModal}
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





                {/*初始化筛选菜单模态*/}
                <Modal animationType='none'
                       transparent={true}
                       visible={this.state.isUSSiftModal}
                       onRequestClose={() => this.onRequestClose()}>
                    <CommunalSiftMenu  removeModal={(data) => this.closeModal(data)}
                                       data={HTSiftData}   loadByMall={(mall,cate)=>this.loadByMall(mall,cate)}
                    />



                </Modal>

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


 