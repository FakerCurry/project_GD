import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    View,
    Image,
    TouchableOpacity
    , DeviceEventEmitter
    , Dimensions
} from 'react-native';

import Menu from '../slidemenu/GDSlidemenu';
import Main from '../main/GDMain';
import SideMenu from 'react-native-side-menu';

const {width, height}=Dimensions.get("window");

type Props = {};
export default class GDSlidemenuMain extends Component<Props> {
//es6 构造
    constructor(props) {

        super(props);
        //出事状态
        this.state = {

            isOpenState: false,

        };
    }

    componentDidMount() {


        this.subscription = DeviceEventEmitter.addListener('menuDEE', (data) => {

            // 打开menu
            this.setState({

                isOpenState: data,
            })

        });

    }

    componentWillUnmount() {
        this.subscription.remove();
    }

    render() {

        const menu = <Menu navigator={navigator}/>;

        return (
            <SideMenu menu={menu} isOpen={this.state.isOpenState} openMenuOffset={2*width/3} >
                <Main/>
            </SideMenu>
        );
    }

}

