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
    Text
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

import Settings from './GDSettings';


const {width, height} = Dimensions.get("window");


type Props = {};
export default class GDHourList extends Component<Props> {
    constructor(props) {
        super(props);

        //初始状态
        this.state = {

            dataSource: [],
            loaded: false,
            refreshState: RefreshState.Idle,
            isRefreshing: false,
            isModal: false,
            prompt:''


        };

        this.data = [];
        this.nowHour = 0;

        this.nexthourhour="";
        this.nexthourdate="";
        this.lasthourhour="";
        this.lasthourdate="";

        //需要绑定
        this.fetchData = this.fetchData.bind(this)
        this.renderItem = this.renderItem.bind(this)
    }


    //网络请求的方法
    //type 0:普通请求    1：下拉刷新   2：上拉加载
    fetchData(type,date,hour) {


        let params={};
        
        if (date) {

            params={
                "date":date,
                "hour":hour

            }
        }
        


        HTTPBase.get('http://guangdiu.com/api/getranklist.php',params)
            .then(responseData => {

                //暂时保存数据
                this.nexthourhour=responseData.nexthourhour;
                this.nexthourdate=responseData.nexthourdate;
                this.lasthourhour=responseData.lasthourhour;
                this.lasthourdate=responseData.lasthourdate;
                this.setState({


                    prompt:responseData.displaydate+responseData.rankhour+'点档'+'('+responseData.rankduring+')'

                })


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




                }


            }).catch((error) => {




        }).done()


    }




    componentDidMount() {
        let type = 0;

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
            let type = 1;
            this.fetchData(type);

            // this.setState({
            //     dataList: dataList,
            //     refreshState: dataList.length < 1 ? RefreshState.EmptyData : RefreshState.Idle,
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
    pushToDetail(value) {

        this.props.navigator.push({


            component: CommunalDetail,
            params: {
                url: 'https://guangdiu.com/api/showdetail.php' + '?' + 'id=' + value
            }
        })
    }


    //跳转到设置
    pushToSetting() {


        this.props.navigator.push({

            component:Settings,


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


    //返回中间按钮
    renderTitleItem() {
        return (
            <TouchableOpacity>
                <Image source={{uri: 'navtitle_rank_106x20'}} style={styles.navbarTitleItemStyle}/>

            </TouchableOpacity>

        );


    }

    //返回右边按钮
    renderRightItem() {

        return (

            <TouchableOpacity
                onPress={()=>{
                    this.pushToSetting()

                }}
            >
                <Text style={styles.navbarRightItemStyle}>设置</Text>

            </TouchableOpacity>

        );


    }

    // nowDate() {
    //
    //     //获取当前时间
    //     let date = new Date();
    //     let year = date.getFullYear();//年
    //     let month = date.getMonth();//月
    //     let day = date.getDate();//日
    //
    //     if (month >= 0 && month <= 8) {//在10以内，我们手动添加0
    //         month = "0" + (month + 1);
    //
    //
    //     } else {
    //         month = (month+1).toString();
    //     }
    //
    //     if (day >= 1 && day <= 9) {//在10以内，我们手动添加0
    //         day = "0" + day;
    //
    //     } else {
    //
    //         day = day.toString();
    //     }
    //
    //     return year + month + day;
    //
    //
    // }

    //上一小时
    lastHour() {


        let type=0;
        this.fetchData(type,this.lasthourdate,this.lasthourhour);

    }

    // 下一小时
    nextHour() {
        let type=0;
        this.fetchData(type,this.nexthourdate,this.nexthourhour);

    }


    render() {
        return (
            <View style={styles.container}>


                {/*导航栏样式*/}
                <CommunalNavBar

                    titleItem={() => this.renderTitleItem()}
                    rightItem={() => this.renderRightItem()}
                />
                {/*提醒栏*/}
                <View style={styles.promptViewStyle}>

                    <Text>{this.state.prompt}</Text>

                </View>

                {/*根据网络状态局部渲染FlatView*/}
                {this.renderFlatView()}

                {/*操作栏*/}
                <View style={styles.operationViewStyle}>
                    <TouchableOpacity onPress={() => this.lastHour()}>
                        <Text style={{marginRight: 10, fontSize: 17, color: 'green'}}>{"<" + "上一小时"}</Text>

                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.nextHour()}>
                        <Text style={{marginLeft: 10, fontSize: 17, color: 'green'}}>{"下一小时" + ">"}</Text>

                    </TouchableOpacity>

                </View>


            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,

        alignItems: 'center',

    },
    navbarTitleItemStyle: {
        width: 106,
        height: 20,
        marginLeft: 50
    }

    ,
    navbarRightItemStyle: {
        fontSize: 17,
        color: 'rgba(123,178,114,1.0)',
        marginRight: 15,
    },
    promptViewStyle: {

        width: width,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(250,250,250,1.0)',

    },
    operationViewStyle: {

        width: width,
        height: 44,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',

    }
});
