import React, { useEffect, useState } from 'react'
import { Modal, Alert, Pressable, PermissionsAndroid, Image, Dimensions, ActivityIndicator, ImageBackground, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import NetInfo from "@react-native-community/netinfo";

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;
const blue = '#0D4AA7';
const black = '#616161';
const red = '#C74B4C';


const NoInternet = () => {
    const [loading, setLoading] = useState(false);
    
    return (

        <View style={[styles.container, loading ? { opacity: 0.5 } : { opacity: 1 }]}>
            <View style={styles.content}>

                <Image style={styles.img} source={require('../assets/img/no-internet.png')} />
                {loading && (
                    <ActivityIndicator size="large" style={{
                        position: 'absolute',
                        alignItems: 'center',
                        justifyContent: 'center',
                        top: 0,
                        bottom: 0,
                        right: 0,
                        left: 0,
                        color: 'blue'
                    }} />
                )}
                <Text style={styles.h2}>Koneksi Terputus</Text>
                <Text style={styles.h3}>Periksa koneksi internet Anda dan coba lagi</Text>
            </View>
        </View>
    )
}

export default NoInternet

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: width,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: '5.5%',
        paddingVertical: '7%',
    },
    img: {
        width: width * 0.65,
        height: width * 0.65,
    },
    h1: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20,
        color: blue,
    },
    h2: {
        fontSize: 22,
        fontWeight: 'bold',
        color: black
    },
    h3: {
        fontSize: 18,
        color: black,
    },
})