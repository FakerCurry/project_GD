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
    AsyncStorage,
    TextInput,
    Text, DeviceEventEmitter
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

import NoDataView from "../main/GDNoData";

import CommunalCell from "../main/GDCommunalCell";





const {width, height} = Dimensions.get("window");

//控制键盘消失
const  dismissKeyboard=require('dismissKeyboard');

type Props = {};
export default class GDHome extends Component<Props> {


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

        this.data = [];
        this.changeText='';

        //需要绑定
        this.fetchData = this.fetchData.bind(this)
        this.renderItem = this.renderItem.bind(this)
    }

    //网络请求的方法
    //type 0:普通请求    1：下拉刷新   2：上拉加载
    fetchData(type) {

        if (!this.changeText)return;


        let params ;
        if (type === 2) {
            //读取存储的id
            AsyncStorage.getItem('searchLastID')
                .then((value) => {


                    params={"sinceid":value, "q":this.changeText};


                })


        }else {
            params={ "q":this.changeText};

        }

        HTTPBase.post('http://guangdiu.com/api/getresult.php', params)
            .then(responseData => {




                if (type === 0) {
                    this.data = responseData.data;

                    this.setState({

                        dataSource: this.data,
                        loaded: true

                    })



                } else if (type === 1) {

                    this.data = responseData.data;


                    this.setState({
                        dataSource: this.data,
                        isRefreshing: false,
                        loaded: true
                    })




                } else {


                    //拼接数组
                    this.data = this.data.concat(responseData.data);


                    this.setState({
                        dataSource: this.data,
                        refreshState: responseData.data.length < 1 ? RefreshState.NoMoreData : RefreshState.Idle,
                        loaded: true
                    })

                }


                //存储数组中最后一个元素的id
                let searchLastID = responseData.data[responseData.data.length - 1].id;

                AsyncStorage.setItem('searchLastID', searchLastID.toString());


            }).catch((error) => {



        }).done()


    }


    componentWillMount() {
        DeviceEventEmitter.emit('isHiddenTabBar', true);
    }



    componentWillUnmount() {

        DeviceEventEmitter.emit('isHiddenTabBar', false);

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
    pushToDetail(value) {

        this.props.navigator.push({


            component: CommunalDetail,
            params: {
                url: 'https://guangdiu.com/api/showdetail.php' + '?' + 'id=' + value
            }
        })
    }


    //返回每一行cell的样式
    renderItem({item}) {


        return (

            <TouchableOpacity
                onPress={() => this.pushToDetail(item.id)}
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


    pop() {
        //使得键盘消失
        dismissKeyboard();

        this.props.navigator.pop();
    }


    //返回左边按钮
    renderLeftItem() {

        return (

            <TouchableOpacity onPress={() => {
                this.pop()
            }}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image source={{uri: 'back'}} style={styles.navbarLeftItemStyle}/>

                    <Text >返回</Text>
                </View>


            </TouchableOpacity>

        );


    }


    //返回中间按钮
    renderTitleItem() {
        return (
            <TouchableOpacity

            >
                <Text>搜索全网折扣</Text>

            </TouchableOpacity>

        );


    }


    // 模态跳转
    render() {
        return (
            <View style={styles.container}>

                {/*导航栏样式*/}
                <CommunalNavBar
                    leftItem={() => this.renderLeftItem()}
                    titleItem={() => this.renderTitleItem()}

                />
                {/*顶部工具栏*/}
                <View style={styles.toolsViewStyle}>
                    {/*左边*/}
                    <View style={styles.inputViewStyle}>
                        <Image source={{uri: 'search_icon_20x20'}} style={styles.searchImageStyle}/>
                        <TextInput
                            keyboardType='default'
                            style={styles.textInputStyle}
                            placeholder='请输入搜索商品关键字'
                            placeholderTextColor='gray'
                            autoFocus={true}
                            clearButtonMode="while-editing"
                            underlineColorAndroid="transparent"
                            onChangeText={(text)=>
                            {this.changeText=text
                            }}
                            onEndEditing={()=>{
                                let type=0
                                this.fetchData(type)

                            }}

                        />

                    </View>
                    {/*右边*/}

                    <View style={{marginRight: 10}}>

                        <TouchableOpacity
                            onPress={()=>{

                                this.pop()
                            }}
                        >
                            <Text style={{color:'green'}}>取消</Text>

                        </TouchableOpacity>


                    </View>

                </View>
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


    },
    searchImageStyle: {

        width: 15,
        height: 15,
        marginLeft:8
    },
    inputViewStyle: {

        height: 35,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',

        marginLeft: 10,
        backgroundColor: 'rgba(239,239,241,1.0)',
        borderRadius:5

    },
    toolsViewStyle: {

        width: width,
        height: 44,
        flexDirection: 'row',
        alignItems: 'center',


      justifyContent: 'space-between'



    },
    textInputStyle:{

        width:width*0.75,
        height:40,
        marginLeft:8

    }
});


