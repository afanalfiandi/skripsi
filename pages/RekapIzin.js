import { StyleSheet, FlatList, Text, Image, View, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions'
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
const bulan = [
  {
    number: 1,
    nama: 'Januari'
  },
  {
    number: 2,
    nama: 'Februari'
  },
  {
    number: 3,
    nama: 'Maret'
  },
  {
    number: 4,
    nama: 'April'
  },
  {
    number: 5,
    nama: 'Mei'
  },
  {
    number: 6,
    nama: 'Juni'
  },
  {
    number: 7,
    nama: 'Juli'
  },
  {
    number: 8,
    nama: 'Agustus'
  },
  {
    number: 9,
    nama: 'September'
  },
  {
    number: 10,
    nama: 'Oktober'
  },
  {
    number: 11,
    nama: 'November'
  },
  {
    number: 12,
    nama: 'Desember '
  },
];

const blue = '#0D4AA7';
const black = '#616161';
const red = '#C74B4C';

const RekapIzin = () => {
  const [data, setData] = useState();
  const [month, setMonth] = useState(null);
  const navigation = useNavigation();
  const selectMonth = async (number) => {
    const userId = await AsyncStorage.getItem('userId');
    setMonth(number);
    fetch('https://afanalfiandi.com/attendly/api/api.php?op=getRekapIzin', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: userId,
        bulan: number
      })
    }).then((response) => response.json())
      .then((responseJson) => {
        if (responseJson != null) {
          setData(responseJson);
          console.log(responseJson);
        } else {
          setData(null);
        }
      }).catch((e) => {
        console.log(e);
      })
  }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Profil')}>
          <Image source={require('../assets/img/icon/back-blue.png')} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Rekap Izin</Text>
      </View>
      <View style={styles.slideContainer}>
        <FlatList
          data={bulan}
          horizontal={true}
          renderItem={({ item }) => (
            <View style={styles.monthSlide}>
              <TouchableOpacity onPress={() => {
                selectMonth(item.number);
              }}>
                <Text style={styles.monthText}>{item.nama}</Text>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={item => item.number}
          showsVerticalScrollIndicator={true}
          style={styles.bulanSlider}
        ></FlatList>
      </View>
      <View style={styles.content}>
        {month == null && (
          <Text style={styles.monthName}>Bulan : (pilih bulan)</Text>
        )}
        {month != null && (
          <Text style={styles.monthName}>Bulan : {moment().month(month - 1).format('MMMM')}</Text>
        )}
        {data != null && (
          <FlatList
            data={data}
            renderItem={({ item }) => (
              <View style={styles.dataContainer}>
                <View style={styles.dateContainer}>
                  <Text style={styles.dateText}>{item.tgl}</Text>
                  <Text style={styles.dayText}>{moment(item.date).format('ddd')}</Text>
                </View>
                <View style={styles.presensiContainer}>
                  <Text style={styles.presensiTitle}>Jenis Izin</Text>
                  <Text style={styles.clockText}>{item.izin}</Text>
                  <Text style={styles.presensiTitle}>Keterangan</Text>
                  <Text style={styles.clockText}>{item.keterangan}</Text>
                </View>
              </View>
            )}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={true}
            style={styles.bulanSlider}
          ></FlatList>

        )}

        {data == null && (
          <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: blue }}>Rekap kosong . . .</Text>
          </View>
        )}
      </View>
    </View>
  )
}

export default RekapIzin

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 25,
    flex: 1
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    fontSize: responsiveFontSize(2.3),
    fontWeight: 'bold',
    color: blue,
    marginLeft: 20
  },
  slideContainer: {
    paddingVertical: 15
  },
  monthText: {
    marginHorizontal: 20,
    fontSize: responsiveFontSize(2),
    color: blue,
    fontWeight: '600',
    marginVertical: 10
  },
  content: {
    flex: 1
  },
  dataContainer: {
    height: 130,
    width: '100%',
    backgroundColor: '#E5E8EC',
    borderRadius: 28,
    alignItems: 'center',
    paddingRight: 35,
    paddingLeft: 15,
    flexDirection: 'row',
    marginBottom: 25,
  },
  dateContainer: {
    width: '26%',
    height: 100,
    backgroundColor: 'white',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center'
  },
  dateText: {
    fontSize: responsiveFontSize(4),
    color: blue,
    fontWeight: 'bold'
  },
  dayText: {
    fontSize: responsiveFontSize(2),
    color: blue,
  },
  presensiContainer: {
    width: '74%',
    height: '100%',
    justifyContent: 'center',
    marginLeft: 10,
    paddingVertical: 10
  },
  divider: {
    width: '0.8%',
    height: '50%',
    backgroundColor: 'white',
  },
  presensiTitle: {
    fontSize: responsiveFontSize(2.4),
    fontWeight: 'bold',
    color: blue,
    paddingVertical: 6
  },
  clockText: {
    color: '#8AABDC',
    textAlign: 'justify'
  },
  monthName: {
    color: blue,
    fontWeight: 'bold',
    marginBottom: 15,
    fontSize: responsiveFontSize(2)
  }
})  