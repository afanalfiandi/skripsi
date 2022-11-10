import { useFocusEffect } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { PermissionsAndroid, Image, Dimensions, ActivityIndicator, ImageBackground, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from '@react-native-community/geolocation';
import { getPreciseDistance } from 'geolib';
import LinearGradient from 'react-native-linear-gradient';

import moment from 'moment'
import 'moment/locale/id';

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;
const blue = '#0D4AA7';
const black = '#616161';
const red = '#C74B4C';

const latSekolah = '-7.4214337';
const longSekolah = '109.2542909';

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [jam, setJam] = useState();

  const [data, setData] = useState([{
    nama: '',
    nip: '',
    img: ''
  }]);

  const [distance, setDistance] = useState();
  useEffect(() => {
    getData();
    getJam();
  });

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
      .then((json) => {
        setJam(json);
      })

  }
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

        // jika berhasil ambil data

        if (responseJson != 'Failed') {
          setTimeout(async () => {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
            );

            // ambil juga titik koordinat
            Geolocation.getCurrentPosition((position) => {
              const lat = JSON.stringify(position.coords.latitude);
              const long = JSON.stringify(position.coords.longitude);
              const dist = getPreciseDistance(
                { latitude: latSekolah, longitude: longSekolah },
                { latitude: lat, longitude: long },
              );

              // matikan loading
              setLoading(false);

              // simpan data user dan titik koordinat ke dalam state
              setDistance(dist);
              setData(responseJson);

            }, (error) => {
              console.log(error);
            })
          }, 3000);
        } else {
          setData('asd');
        }
      })
      .catch((e) => {
        console.log(e);
      })
  }
  return (

    <View style={styles.container}>
      {loading && (
        <ActivityIndicator size="large" style={{
          position: 'absolute',
          alignItems: 'center',
          justifyContent: 'center',
          top: 0,
          bottom: 0,
          right: 0,
          left: 0,
          color: blue
        }} />
      )}


      {!loading && (
        <ImageBackground source={require('../assets/img/background.png')} resizeMode="cover" style={styles.image}>
          <View style={styles.header}>

            <View style={styles.userContainer}>
              <Text style={styles.h1}>{data.nama}</Text>
              <Text style={styles.h2}>{data.nip}</Text>

            </View>
            <View style={styles.imgContainer}>
              <TouchableOpacity>
                <Image style={styles.userImg} source={{ uri: 'https://afanalfiandi.com/attendly/uploads/img/' + data.img }} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.clockContainer}>
            <Text style={styles.clock}>{moment().format("h:mm")}</Text>
            <Text style={styles.day}>{moment().format("dddd, Do MMMM YYYY")}</Text>
          </View>


          {distance < 50 && (
            <TouchableOpacity style={[styles.btn, { backgroundColor: blue }]}>
              <Image source={require('../assets/img/icon/absen-finger.png')} />
              <Text style={styles.btnText}>MASUK</Text>
            </TouchableOpacity>
          )}

          {distance >= 50 && (
            <TouchableOpacity style={[styles.btn]} disabled={true}>
              <LinearGradient colors={['#E73272', '#863398']} style={styles.liner}>
                <Image source={require('../assets/img/icon/absen-finger.png')} />
                <Text style={styles.btnText}>MASUK</Text>
              </LinearGradient>

            </TouchableOpacity>
          )}
          {/* {distance >= 50 && (
            <TouchableOpacity style={[styles.btn, { backgroundColor: red }]} disabled={true}>
              <Image source={require('../assets/img/icon/absen-finger.png')} />
              <Text style={styles.btnText}>MASUK</Text>
            </TouchableOpacity>
          )} */}
          <View style={styles.distanceContainer}>
            <Image source={require('../assets/img/icon/gps-black.png')} />

            {distance >= 50 && (
              <Text style={[styles.distanceText, { color: red }]}>
                Jarak : {distance} Meter
              </Text>
            )}
            {distance < 50 && (
              <Text style={[styles.distanceText, { color: black }]}>
                Jarak : {distance} Meter
              </Text>
            )}

          </View>

          <View style={styles.historyContainer}>
            <View style={styles.column}>

              <View style={styles.historyTextContainer}>
                <Image style={styles.clockImg} source={require('../assets/img/icon/clock-masuk.png')} />
                {jam.masuk != null && (
                  <Text style={styles.historyText}>{jam.masuk} </Text>
                )}

                {jam.masuk == null && (
                  <Text style={styles.historyText}>--:-- </Text>
                )}
                <Text >MASUK </Text>
              </View>
            </View>
            <View style={styles.column}>

              <View style={styles.historyTextContainer}>
                <Image style={styles.clockImg} source={require('../assets/img/icon/clock-pulang.png')} />
                {jam.pulang != null && (
                  <Text style={styles.historyText}>{jam.pulang} </Text>
                )}

                {jam.pulang == null && (
                  <Text style={styles.historyText}>--:-- </Text>
                )}
                <Text>PULANG </Text>
              </View>
            </View>
          </View>
        </ImageBackground>
      )}
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  image: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    alignItems: 'center'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    top: '7%',
    right: 0,
    left: 0,
    padding: 20,
    position: 'absolute'
  },
  userContainer: {
    alignItems: 'center',
    flex: 1,
  },
  h1: {
    fontSize: width * 0.06,
    textTransform: 'uppercase',
    color: black
  },
  h2: {
    color: black,
    fontSize: width * 0.04,
  },
  userImg: {
    width: 35,
    height: 35,
    borderRadius: 100,
    elevation: 5
  },
  imgContainer: {
    elevation: 5

  },
  clockContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: '20%',
  },
  clock: {
    fontSize: width * 0.12,
    fontWeight: 'bold',
    color: black
  },
  day: {
    fontSize: width * 0.05,
    color: black
  },
  btn: {
    alignItems: 'center',
    width: 150,
    justifyContent: 'center',
    borderRadius: 200,
    height: 150,
    shadowColor: "#000",
    shadowOffset: {
      width: 5,
      height: 9,
    },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 20,
  },

  liner: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    borderRadius: 200,

  },
  btnText: {
    color: 'white',
    fontSize: width * 0.045,
    marginTop: 10,
    fontWeight: 'bold'
  },
  distanceContainer: {
    flexDirection: 'row',
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: '10%'
  },
  distanceText: {
    marginLeft: '2%',
    fontSize: width * 0.045,
    fontWeight: 'bold'
  },
  historyContainer: {
    width: width,
    justifyContent: 'space-between',
    paddingHorizontal: '15%',
    paddingVertical: '1%',
    alignItems: 'center',
    flexDirection: 'row',
    bottom: '10%',
    right: 0,
    left: 0,
    position: 'absolute'
  },
  column: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyTextContainer: {
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  historyText: {
    fontSize: width * 0.06,
    marginTop: 10,
    fontWeight: 'bold',
    color: black
  },
  clockImg: {
    width: 30,
    height: 30,
    opacity: 0.7
  }
});

export default Home;