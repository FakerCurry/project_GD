import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    View,
    Image,
    TouchableOpacity, Text
} from 'react-native';

import MenuHeader from '../slidemenu/menu/GDLeftMenutop';


type Props = {};
export default class GDSlidemenu extends Component<Props> {



    render() {



        return (
            <View style={styles.container}>
             <MenuHeader/>



            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,

        alignItems: 'center',

    },

});
