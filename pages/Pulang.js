import { StyleSheet, RefreshControl, Dimensions, Image, TouchableOpacity, PermissionsAndroid, Text, View, Alert, TouchableOpacityBase, ScrollView } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { getPreciseDistance } from 'geolib';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';

import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { responsiveHeight } from 'react-native-responsive-dimensions';
const primary = '#4E83D2';
const secondary = '#F7B44C';
const danger = '#C74B4C';
var height = Dimensions.get('window').height;
var width = Dimensions.get('window').width;
const Pulang = () => {

    useEffect(() => {
        calculate();
        getJam();
    })
    const navigation = useNavigation();
    const latSekolah = '-7.4214337';
    const longSekolah = '109.2542909';
    const [latUser, setLatUser] = useState();
    const [longUser, setLongUser] = useState();
    const [jarak, setJarak] = useState();
    const [jamPulang, setJamPulang] = useState('--:--');
    const [jamMasuk, setJamMasuk] = useState('--:--');
    const [refreshing, setRefreshing] = useState(false);

    const date = new Date();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(async () => {
            navigation.navigate('Pulang');
            setRefreshing(false);
        }, 2000)
    }, []);

    const getJam = async () => {
        const userId = await AsyncStorage.getItem('userId');

        fetch('https://afanalfiandi.com/attendly/api/api.php?op=getJam', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: userId
            })
        }).then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.masuk != null && responseJson.pulang != null) {
                    setJamMasuk(responseJson.masuk);
                    setJamPulang(responseJson.pulang);
                } else if (responseJson.masuk != null) {
                    setJamMasuk(responseJson.masuk);
                }
            }).catch((e) => {
                console.log(e);
            })
    }

    const calculate = async () => {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            Geolocation.getCurrentPosition((position) => {
                const lat = JSON.stringify(position.coords.latitude);
                const long = JSON.stringify(position.coords.longitude);
                const distance = getPreciseDistance(
                    { latitude: latSekolah, longitude: longSekolah },
                    { latitude: lat, longitude: long },
                );
                setJarak(distance);
                setLatUser(lat);
                setLongUser(long);
            }, (error) => {
                if (error.code == 2) {
                    Alert.alert('', 'GPS tidak aktif. Aktifkan sekarang?',
                        [
                            {
                                text: "Batal",
                                style: "cancel"
                            },
                            {
                                text: "OK", onPress: () =>
                                    RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
                                        interval: 10000,
                                        fastInterval: 5000,
                                    })
                                        .then((data) => {
                                        })
                                        .catch((err) => {
                                            console.log(err);
                                        })
                            }
                        ]
                    );
                }
            })
        } else {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: "Aktifkan Izin Lokasi",
                        message:
                            "Untuk menggunakan aplikasi, beri izin lokasi",
                        buttonNeutral: "Tanya Nanti",
                        buttonNegative: "Batal",
                        buttonPositive: "Izinkan"
                    }
                );
            } catch (err) {
                console.log(err);

            }
        }
    }

    const presensi = async () => {
        const userId = await AsyncStorage.getItem('userId');

        if (jarak <= 50) {
            fetch('https://afanalfiandi.com/attendly/api/api.php?op=addPresensiPulang', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: userId,
                    lat: latUser,
                    long: longUser
                })
            }).then((response) => response.json())
                .then((responseJson) => {
                    if (responseJson == 'Success') {
                        setJamPulang(hours + ':' + minutes + ':' + seconds);
                        Alert.alert('Status Presensi', 'Presensi pulang berhasil!');
                    } else {
                        Alert.alert('Status Presensi', 'Presensi pulang gagal!');
                    }
                })
                .catch((e) => {
                    console.log(e);
                })
        } else {
            console.log(jarak);
        }
    }
    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollView}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                <View style={styles.mapContainer}>
                    <MapView
                        style={{ width: '100%', height: '100%' }}
                        provider={PROVIDER_GOOGLE}
                        initialRegion={{
                            latitude: -7.4214337,
                            longitude: 109.2542909,
                            latitudeDelta: 0.010,
                            longitudeDelta: 0.010,
                        }}
                        showsUserLocation={true}
                    >
                        <Marker coordinate={{
                            latitude: -7.4214337,
                            longitude: 109.2542909,
                        }} />
                    </MapView>
                    <View style={styles.buttonCallout}>
                        <TouchableOpacity
                            style={styles.backBtn}
                            onPress={() => navigation.navigate("Home")}
                        >
                            <Image source={require('../assets/img/icon/back-blue.png')} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View elevation={3} style={styles.content}>
                    <Text style={styles.headerText}>Presensi Pulang</Text>
                    <View style={styles.header}>
                        <Text style={styles.headerText}>Jarak ke titik absensi</Text>
                        <Text style={styles.jarakText}>{jarak} Meter</Text>
                    </View>
                    <View style={styles.jamContainer}>
                        <View style={styles.ketContainer}>
                            <Text style={styles.headerText}>Masuk</Text>
                            <Text style={styles.jamText}>{jamMasuk}</Text>
                        </View>
                        <View style={styles.ketContainer}>
                            <Text style={styles.headerText}>Pulang</Text>
                            <Text style={styles.jamText}>{jamPulang}</Text>
                        </View>
                    </View>
                    {jarak > 50 && (
                        <TouchableOpacity disabled={jarak > 50} onPress={presensi} style={{ backgroundColor: danger, justifyContent: 'center', alignItems: 'center', height: responsiveHeight(5), borderRadius: 10 }}>
                            {/* <Text style={styles.btnText}>{btnText}</Text> */}
                            <Text style={styles.btnText}>Tidak dapat melakukan presensi</Text>
                        </TouchableOpacity>
                    )}
                    {jarak < 50 && (
                        <TouchableOpacity onPress={presensi} style={{ backgroundColor: primary, justifyContent: 'center', alignItems: 'center', height: responsiveHeight(5), borderRadius: 10 }}>
                            {/* <Text style={styles.btnText}>{btnText}</Text> */}
                            <Text style={styles.btnText}>Presensi</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </ScrollView>
        </View>
    )
}

export default Pulang

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    mapContainer: {
        flex: 3,
    },
    content: {
        flex: 2.5,
        paddingHorizontal: width * 0.07
    },
    header: {
        paddingVertical: height * 0.02
    },
    jamContainer: {
        flexDirection: 'row'
    },
    ketContainer: {
        width: '50%',
        justifyContent: 'center',
        marginTop: height * 0.02,
        marginBottom: height * 0.05,
        alignItems: 'center'
    },
    headerText: {
        fontSize: height * 0.024,
        color: primary,
        fontWeight: 'bold',
        marginTop: height * 0.02
    },
    jarakText: {
        fontSize: height * 0.024,
        color: secondary
    },
    jamText: {
        fontSize: height * 0.024,
        color: primary
    },
    btnText: {
        color: 'white',
        fontWeight: 'bold',
    },
    scrollView: {
        flex: 1,
    },

    buttonCallout: {
        flex: 1,
        position: 'absolute',
        borderRadius: 100,
        backgroundColor: 'white',
        margin: width * 0.05,
        width: width * 0.1,
        justifyContent: 'center',
        alignItems: 'center',
        height: width * 0.1,

    },
})