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
    ScrollView, Switch
} from 'react-native';

import PropTypes from 'prop-types';
//应用外部文件
import CommunalNavBar from '../main/GDCommunalNavBar';


type Props = {};
export default class GDSettingsCell extends Component<Props> {

    static propTypes = {

        leftTitle: PropTypes.string,
        isShowSwitch: PropTypes.bool,

    }

    constructor(props) {

        super(props);
        this.state = {

            isOn: true,
        }

    }

    //返回
    renderRightContent() {

        let component;
        if (this.props.isShowSwitch) {//显示switch按钮

            component = <Switch style={styles.switchStyle}  value={this.state.isOn} onValueChange={() => {
                this.setState({
                        isOn: !this.state.isOn

                    }
                )
            }
            }


            />
        } else {


            {/*右边的箭头*/
            }
            component =
                <Image
                    source={{uri: 'icon_cell_rightArrow'}}
                    style={styles.arrowStyle}
                />
        }

        return (

            component
        )

    }

    render() {
        return (

            <View style={styles.container}>
                {/*左边*/}
                <View>

                    <Text>


                        {this.props.leftTitle}
                    </Text>
                </View>
                {/*右边*/}
                <View style={styles.rightViewStyle}>




                        {this.renderRightContent()}

                </View>
            </View>


        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        height: Platform.OS === 'ios' ? 44 : 36,
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomColor: 'gray',
        borderBottomWidth: 0.5,
        marginLeft: 10,

    },
    arrowStyle: {

        width: 10,
        height: 10,
        marginRight: 15


    },
    switchStyle:{
        marginRight: 15
    },
    leftViewStyle: {},
    rightViewStyle: {}
});