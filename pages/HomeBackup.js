import { StyleSheet, Alert, Dimensions, PermissionsAndroid, SafeAreaView, Text, View, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'

import { useNavigation } from '@react-navigation/native';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';

var height = Dimensions.get('window').height;
var width = Dimensions.get('window').width;

const Home = () => {
  useEffect(() => {
    getData();
    getPermission();
  }, []);

  const [img, setImg] = useState();
  const navigation = useNavigation();

  const getData = async () => {
    const userId = await AsyncStorage.getItem('userId');
    fetch('https://afanalfiandi.com/attendly/api/api.php?op=getUser', {
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
        setImg(responseJson.img);
      })
      .catch((e) => {
        console.log(e);
      })
  }
  const getPermission = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      Geolocation.getCurrentPosition((position) => {
        console.log('diijinkan');
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
  return (
    <SafeAreaView style={styles.safeView}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Image source={require('../assets/img/icon/finger-sm-blue.png')} />

          <View style={styles.textContainer}>
            <Text style={styles.title}>Attend.ly</Text>
            <Text style={styles.motto}>Easy way to track & record attendance</Text>
          </View>
          <TouchableOpacity onPress={() => { navigation.navigate('Profil') }}>
            <Image style={styles.profImg} source={{ uri: 'https://afanalfiandi.com/attendly/uploads/img/' + img }} />
          </TouchableOpacity>
        </View>
        <View style={styles.banner}>
          <Image source={require('../assets/img/icon/banner.png')} />
        </View>
        <Text style={{ fontWeight: 'bold', marginLeft: width * 0.05, marginTop: 30, color: '#4E83D2', fontSize: width * 0.05, marginBottom: 20 }}>Presensi</Text>
        <View style={styles.menu}>
          <View style={styles.btnContainer}>
            <TouchableOpacity style={styles.menuBtn} onPress={() => navigation.navigate('Masuk')}>
              <Image source={require('../assets/img/icon/masuk.png')} />
              <Text style={styles.menuText}>Masuk</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuBtn} onPress={() => { navigation.navigate('Pulang') }}>
              <Image source={require('../assets/img/icon/pulang.png')} />
              <Text style={styles.menuText}>Pulang</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.menu}>
          <View style={styles.btnContainer}>
            <TouchableOpacity style={styles.menuBtn} onPress={() => { navigation.navigate('Izin') }}>
              <Image source={require('../assets/img/icon/izin.png')} />
              <Text style={styles.menuText}>Izin</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuBtn} onPress={() => { navigation.navigate('Scan') }}>
              <Image source={require('../assets/img/icon/gps-lg-blue.png')} />
              <Text style={styles.menuText}>Scan</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default Home

const styles = StyleSheet.create({
  safeView: {
    width: width,
    height: height
  },
  container: {
    flex: 1,
    paddingBottom: height * 0.02,
    backgroundColor: 'white',
  },
  header: {
    paddingHorizontal: width * 0.05,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  imgContainer: {
    width: width,
    justifyContent: 'center',
    alignItems: 'center'
  },
  banner: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center'
  },
  menu: {
    flex: 4,
    flexDirection: 'row',
  },
  textContainer: {
    marginLeft: width * 0.03,
    width: '78%'
  },
  title: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: '#4E83D2'
  },
  motto: {
    color: '#4E83D2'
  },
  profImg: {
    width: 40,
    height: 40,
    borderRadius: 100
  },
  btnContainer: {
    flexDirection: 'row',
    width: width,
    justifyContent: 'space-around'
  },
  menuBtn: {
    width: '45%',
    borderWidth: 1,
    borderColor: '#C9D5E5',
    height: '80%',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  menuText: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: '#4E83D2',
    marginTop: 20
  }
})