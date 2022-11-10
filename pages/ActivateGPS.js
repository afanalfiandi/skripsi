import { StyleSheet, Image, Dimensions, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import { useNavigation } from '@react-navigation/native';
import Geolocation from '@react-native-community/geolocation';

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;
const blue = '#0D4AA7';
const black = '#3d3d3d';
const red = '#C74B4C';

const ActivateGPS = () => {
    const navigation = useNavigation();
    const gps = () => {
        RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
            interval: 10000,
            fastInterval: 5000,
        })
            .then((data) => {
                navigation.navigate('Home');
            })
            .catch((err) => {
                console.log(err);
            })
    }

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Image source={require('../assets/img/icon/active-gps.png')} />
                <Text style={styles.h1}>Dimanakah Anda?</Text>
                <Text style={styles.text}>Layanan lokasi Anda perlu diaktifkan agar Attend.ly dapat bekerja dengan baik.</Text>
            </View>

            <TouchableOpacity style={styles.btn} onPress={gps}>
                <Text style={[styles.text, { color: 'white', fontWeight: 'bold' }]}>Aktifkan Lokasi</Text>
            </TouchableOpacity>
        </View>
    )
}

export default ActivateGPS

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        height: height,
        width: width,
        alignItems: 'center',
        padding: 10
    },
    content: {
        height: height * 0.8,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: '5.5%',
        paddingVertical: '7%',
    },
    h1: {
        fontSize: 22,
        margin: 12,
        color: blue,
        fontWeight: 'bold'
    },
    text: {
        color: black,
        fontSize: width * 0.035,
        textAlign: 'center'
    },
    btn: {
        backgroundColor: blue,
        width: '80%',
        padding: 10,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center'
    }
})