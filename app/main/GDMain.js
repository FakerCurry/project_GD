/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View,Image,DeviceEventEmitter} from 'react-native';

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

//饮用外部文件
import Home from '../home/GDHome';
import Ht from '../ht/GDHt';
import HourList from '../hourList/GDHourList';


type Props = {};
export default class GDMain extends Component<Props> {


    //es6
    constructor(props) {

        super(props);
        //出事状态
        this.state = {

            selectedTab: 'home',
            //是否隐藏tabBar
            isHiddenTabBar:false,
        };
    }
    //设置navigator跳转的动画

    setNavAnimationType(route){

        if (route.animationType){//有值
            let conf=route.animationType;
            conf.gestures=null;
            return conf;


        }else{
            return Navigator.SceneConfigs.PushFromRight;
        }
    }


    //返回tabbar　的item
    renderTabBarItem(title, selectedTab, image, selImage, component) {

        return (

            <TabNavigator.Item
                selectedTitleStyle={{color:'black'}}
                selected={this.state.selectedTab === selectedTab}
                title={title}
                renderIcon={() => <Image style={styles.tabIconStyle} source={{uri: image}}/>}
                renderSelectedIcon={() => <Image style={styles.tabIconStyle} source={{uri: selImage}}/>}
                // badgeText="1"
                onPress={() => this.setState({selectedTab: selectedTab})}>

                <Navigator
                    initialRoute={{
                        name: selectedTab,
                        component: component


                    }}

                    configureScene={(route)=>this.setNavAnimationType(route)}
                   renderScene={(route, navigator) => {

                        let Component = route.component;
                        return <Component {...route.params} navigator={navigator}/>

                    }}


                />

            </TabNavigator.Item>

        );

    }

    tongZhi(data){

        this.setState({
            isHiddenTabBar: data,
        })
    }


    componentDidMount() {
        this.subscription = DeviceEventEmitter.addListener('isHiddenTabBar', (data) => {

            this.tongZhi(data)

        });




    }


    componentWillUnmount() {
        this.subscription.remove()
    }

        render() {
        return (


                <TabNavigator
                    tabBarStyle={this.state.isHiddenTabBar!==true?{}:{height: 0,overflow:'hidden'}}
                        sceneStyle={this.state.isHiddenTabBar!==true?{}:{paddingBottom: 0}}

                >
                    {/*首页*/}
                    {this.renderTabBarItem("首页", "home", "tabbar_home_30x30", "tabbar_home_selected_30x30", Home)}
                    {/*海淘*/}
                    {this.renderTabBarItem("海淘", "ht", "tabbar_abroad_30x30", "tabbar_abroad_selected_30x30", Ht)}
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
    tabIconStyle:{

        width: Platform.OS == 'ios' ? 30 : 25,
        height: Platform.OS == 'ios' ? 30 : 25

    }
});
