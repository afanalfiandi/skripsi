import { StyleSheet, TouchableOpacity, PermissionsAndroid, Text, View, Alert, TouchableOpacityBase } from 'react-native'
import React, { useEffect, useState } from 'react'
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

const Scan = () => {

  useEffect(() => {
    calculate();
  }, []);

  const navigation = useNavigation();
  const [latUser, setLatUser] = useState();
  const [longUser, setLongUser] = useState();
  const [mapRegion, setMapRegion] = useState({
    region: {
      latitude: -7.4214337,
      longitude: 109.2542909,
      latitudeDelta: 0.010,
      longitudeDelta: 0.010
    }
  });
  const [jarak, setJarak] = useState();
  const latSekolah = '-7.4214337';
  const longSekolah = '109.2542909';

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
        setMapRegion({
          region: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.010,
            longitudeDelta: 0.010
          }
        });

        console.log(mapRegion);


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
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <MapView
          style={{ width: '100%', height: '100%' }}
          provider={PROVIDER_GOOGLE}
          initialRegion={mapRegion.region}
          showsUserLocation={true}
        >
        </MapView>
      </View>
      <View elevation={3} style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Titik Lokasi Anda</Text>
          <Text style={styles.jarakText}>Latitude : {latUser}</Text>
          <Text style={styles.jarakText}>Longitude : {longUser}</Text>
        </View>
        <View style={styles.header}>
          <Text style={styles.headerText}>Jarak ke titik absensi</Text>
          <Text style={styles.jarakText}>{jarak} Meter</Text>
        </View>
        <TouchableOpacity onPress={() => { navigation.navigate('Home') }} style={{ backgroundColor: primary, marginTop: 10, justifyContent: 'center', alignItems: 'center', height: responsiveHeight(5), borderRadius: 10 }}>
          <Text style={styles.btnText}>OK</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default Scan

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
    paddingTop: 30,
    paddingHorizontal: 20
  },
  header: {
    paddingVertical: 30
  },
  jamContainer: {
    flexDirection: 'row'
  },
  ketContainer: {
    width: '50%',
    paddingVertical: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerText: {
    fontSize: 20,
    color: primary,
    fontWeight: 'bold'
  },
  jarakText: {
    fontSize: 18,
    color: secondary
  },
  jamText: {
    fontSize: 18,
    color: primary
  },
  btnText: {
    color: 'white',
    fontWeight: 'bold',
  }
})