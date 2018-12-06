import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    View,
    Image,
    TouchableOpacity, Text,
    Dimensions
} from 'react-native';


const {width, height}=Dimensions.get("window");



type Props = {};
export default class GDLeftMenutop extends Component<Props> {



    render() {



        return (
            <View style={styles.container}>
              {/*头像*/}
                <Image source={{uri: 'drawer_avatar'}} style={styles.avatarStyle}/>
                {/*名称*/}

                <Text style={styles.textStyle}>老祖</Text>
                {/*作者邮箱*/}
                <Text style={styles.textStyle}>作者邮箱:1175476869@qq.com</Text>

            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        width:2*width/3,

        height:1*height/4,
        flexDirection: 'column',


        backgroundColor:'green',
        justifyContent:'center',
        padding: 10

    },avatarStyle:{

        width:50,
        height:50,
        marginBottom: 10


    },textStyle:{
        color:'white',
        fontSize:13,


    }

});
