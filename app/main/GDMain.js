/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Image, DeviceEventEmitter, AsyncStorage, BackHandler} from 'react-native';

const instructions = Platform.select({
    ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
    android:
        'Double tap R on your keyboard to reload,\n' +
        'Shake or press menu button for dev menu',
});

// 引入第三方框架
import TabNavigator from 'react-native-tab-navigator';
//https://blog.csdn.net/s8460049/article/details/73331043
import {Navigator} from 'react-native-deprecated-custom-components';

import RNExitApp from 'react-native-exit-app';
//饮用外部文件
import Home from '../home/GDHome';
import Ht from '../ht/GDHt';
import HourList from '../hourList/GDHourList';


type Props = {};
export default class GDMain extends Component<Props> {


    //es6 构造
    constructor(props) {

        super(props);
        //出事状态
        this.state = {

            selectedTab: 'home',
            //是否隐藏tabBar
            isHiddenTabBar: false,
            cnBadgeText: '',
            usBadgeText: ''
        };
    }

    //设置navigator跳转的动画
    setNavAnimationType(route) {

        if (route.animationType) {//有值
            let conf = route.animationType;
            conf.gestures = null;
            return conf;


        } else {
            return Navigator.SceneConfigs.PushFromRight;
        }
    }


//点击了item
    clickItem(selectedTab,subscription){
        
        if (subscription!==""&&this.state.selectedTab==selectedTab) {

            DeviceEventEmitter.emit(subscription);
        }
        

        //渲染页面
        this.setState({selectedTab: selectedTab})


    }

    //返回tabbar　的item
    renderTabBarItem(title, selectedTab, image, selImage, component, badgeText,subscription) {

        return (

            <TabNavigator.Item
                selectedTitleStyle={{color: 'black'}}
                selected={this.state.selectedTab === selectedTab}
                title={title}
                badgeText={badgeText === '0' ? '' : badgeText}
                renderIcon={() => <Image style={styles.tabIconStyle} source={{uri: image}}/>}
                renderSelectedIcon={() => <Image style={styles.tabIconStyle} source={{uri: selImage}}/>}
                // badgeText="1"
                onPress={() => this.clickItem(selectedTab,subscription)}>

                <Navigator
                    initialRoute={{
                        name: selectedTab,
                        component: component


                    }}

                    configureScene={(route) => this.setNavAnimationType(route)}
                    renderScene={(route, navigator) => {

                        let Component = route.component;
                        return <Component {...route.params} navigator={navigator} loadDatanumber={()=>this.loadDataNumber()}/>

                    }}


                />

            </TabNavigator.Item>

        );

    }

    //是否隐藏底部导航栏
    tongZhi(data) {

        this.setState({
            isHiddenTabBar: data,
        })
    }


    //获取最新数据的个数的网络请求
    loadDataNumber() {

        //取出id
        AsyncStorage.multiGet(['cnfirstID', 'usfirstID'], (error, stores) => {
//参数拼接
            let params = {

                "cnmaxid": stores[0][1],
                "usmaxid": stores[1][1]
            }
            //请求网络数据
            HTTPBase.get('http://guangdiu.com/api/getnewitemcount.php', params)
                .then((responseData) => {


                    this.setState({

                        cnBadgeText: responseData.cn,
                        usBadgeText: responseData.us


                    })

                }).catch((error) => {

            })

        });





    }

// 组建加载完成
    componentDidMount() {



        this.subscription = DeviceEventEmitter.addListener('isHiddenTabBar', (data) => {

            this.tongZhi(data)

        });

        // let cnfirstID = 0;
        // let usfirstID = 0;


        //定时器
        //最新数据个数
        setInterval(() => {


            this.loadDataNumber();


        }, 3000)


    }

// 组建即将销毁
    componentWillUnmount() {
        this.subscription.remove()

        if (Platform.OS === 'android') {
            BackHandler.removeEventListener('hardwareBackPress', this.onBackHandler);
        }


    }




    componentWillMount() {

        if (Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress', this.onBackHandler);
        }

    }















    onBackHandler = () => {

        RNExitApp.exitApp();
        return true;
    };


    render() {
        return (


            <TabNavigator
                tabBarStyle={this.state.isHiddenTabBar !== true ? {} : {height: 0, overflow: 'hidden'}}
                sceneStyle={this.state.isHiddenTabBar !== true ? {} : {paddingBottom: 0}}

            >
                {/*首页*/}
                {this.renderTabBarItem("首页", "home", "tabbar_home_30x30", "tabbar_home_selected_30x30", Home, this.state.cnBadgeText,"clickHomeItem")}
                {/*海淘*/}
                {this.renderTabBarItem("海淘", "ht", "tabbar_abroad_30x30", "tabbar_abroad_selected_30x30", Ht, this.state.usBadgeText,"clickHTItem")}
                {/*小时风云帮*/}
                {this.renderTabBarItem("小时风云榜", "hourList", "tabbar_rank_30x30", "tabbar_rank_selected_30x30", HourList)}
            </TabNavigator>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    tabIconStyle: {

        width: Platform.OS == 'ios' ? 30 : 25,
        height: Platform.OS == 'ios' ? 30 : 25

    }
});

