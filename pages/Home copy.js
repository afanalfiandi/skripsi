import { StyleSheet, PixelRatio, Image, Text, Dimensions, View, TouchableOpacity } from 'react-native'
import React from 'react'

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;
const blue = '#4E83D2';

const Home = () => {
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.logoContainer}>
          <Image source={require('../assets/img/icon/finger-sm-blue.png')} />
          <View style={styles.headerTxtContainer}>
            <Text style={styles.h1}> Attendly</Text>
            <Text style={styles.h2}> Easy way to track & record attendance</Text>
          </View>
        </View>
        <TouchableOpacity>
          <Image style={styles.photos} source={require('../assets/img/icon/default.png')} />
        </TouchableOpacity>
      </View>
      <View style={styles.bannerContainer}>
        <Image source={require('../assets/img/icon/banner.png')} />
      </View>

      <View style={styles.content}>
        <Text style={styles.h1}> Absensi</Text>
        <View style={styles.column}>
          <TouchableOpacity style={styles.btn}>
            <Image source={require('../assets/img/icon/masuk.png')} />
            <Text style={[styles.h1, {marginTop: 10}]}>Masuk</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btn}>
            <Image source={require('../assets/img/icon/pulang.png')} />
            <Text style={[styles.h1, {marginTop: 10}]}>Pulang</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.column}>
          <TouchableOpacity style={styles.btn}>
            <Image source={require('../assets/img/icon/izin.png')} />
            <Text style={[styles.h1, {marginTop: 10}]}>Izin</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btn}>
            <Image source={require('../assets/img/icon/gps-lg-blue.png')} />
            <Text style={[styles.h1, {marginTop: 10}]}>Scan Lokasi</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
    backgroundColor: 'white',
    padding: '5%'
  },
  headerContainer: {
    paddingVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  headerTxtContainer: {
    marginLeft: 10
  },
  h1: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: blue
  },
  h2: {
    color: blue
  },
  photos: {
    width: 40,
    height: 40,
    borderRadius: 100
  },
  bannerContainer: {
    marginVertical: '3%'
  },
  content: {
    paddingVertical: '5%',
    justifyContent: 'center'
  },
  column: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  btn: {
    borderWidth: 1,
    width: '48%',
    marginVertical: '2%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: '15%',
    borderRadius: 5,
    borderColor: '#DBE3EE'
  },
})