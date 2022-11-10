import { ScrollView, RefreshControl, StyleSheet, Text, Image, View, TouchableOpacity, Touchable, Alert } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const color = '#4E83D2';
const Profil = () => {

  useEffect(() => {
    getUser();
    getMasuk();
    getIzin();
  }, []);

  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const [nama, setNama] = useState();
  const [nip, setNip] = useState();
  const [img, setImg] = useState();
  const [noHP, setNoHP] = useState();
  const [email, setEmail] = useState();
  const [masuk, setMasuk] = useState();
  const [izin, setIzin] = useState();

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(async () => {
      setRefreshing(false);
      const userId = await AsyncStorage.getItem('userId');

      fetch('https://afanalfiandi.com/attendly/api/api.php', {
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
          setNama(responseJson.nama);
          setNip(responseJson.nip);
          setNoHP(responseJson.no_hp);
          setEmail(responseJson.email);
          setImg(responseJson.img);
        }).catch((e) => {
          console.log(e);
        })
    }, 2000)
  }, []);

  const getMasuk = async () => {
    const userId = await AsyncStorage.getItem('userId');
    fetch('https://afanalfiandi.com/attendly/api/api.php?op=getMasuk', {
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
        setMasuk(responseJson.total_masuk);
      }).catch((e) => {
        console.log(e);
      })
  }
  const getIzin = async () => {
    const userId = await AsyncStorage.getItem('userId');
    fetch('https://afanalfiandi.com/attendly/api/api.php?op=getIzin', {
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
        setIzin(responseJson.total_izin);
      }).catch((e) => {
        console.log(e);
      })
  }
  const getUser = async () => {
    const userId = await AsyncStorage.getItem('userId');

    fetch('https://afanalfiandi.com/attendly/api/api.php', {
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
        setNama(responseJson.nama);
        setNip(responseJson.nip);
        setNoHP(responseJson.no_hp);
        setEmail(responseJson.email);
        setImg(responseJson.img);
      }).catch((e) => {
        console.log(e);
      })
  }

  const logout = async () => {
    Alert.alert('', 'Apakah Anda yakin ingin keluar?', [
      {
        text: 'Batal',
        style: 'cancel'
      },
      {
        text: 'Keluar',
        onPress: () => {
          AsyncStorage.removeItem('userId');
          navigation.navigate('SignIn');
        }
      }
    ])
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
        <View style={styles.header}>
          <Text style={styles.titleText}>Profil</Text>
          <TouchableOpacity onPress={() => navigation.navigate('UbahProfil')}>
            <Image onPress={() => setModalVisible(true)} style={styles.penImg} source={require('../assets/img/icon/pen-blue.png')} />
          </TouchableOpacity>
        </View>
        <View style={styles.profileContainer}>
          <Image style={styles.profileImg} source={{ uri: 'https://afanalfiandi.com/attendly/uploads/img/' + img }} />
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>{nama}</Text>
            <Text style={styles.nipText}>NIP. {nip}</Text>
          </View>
        </View>
        <View style={styles.contactContainer}>
          <View style={styles.rowContainer}>
            <Image source={require('../assets/img/icon/phone-blue.png')} />
            <Text style={styles.contactText}>{noHP}</Text>
          </View>
          <View style={styles.rowContainer}>
            <Image source={require('../assets/img/icon/mail-blue.png')} />
            <Text style={styles.contactText}>{email}</Text>
          </View>
        </View>
        <View style={styles.rekapContainer}>
          <View style={styles.column}>
            <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => navigation.navigate('Rekap')}>
              <Text style={styles.totalText}>{masuk}</Text>
              <Text style={styles.jenisText}>Hadir</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.column}>
            <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => navigation.navigate('RekapIzin')}>
              <Text style={styles.totalText}>{izin}</Text>
              <Text style={styles.jenisText}>Izin</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('UbahPassword')}>
            <View style={styles.btnRow}>
              <Image source={require('../assets/img/icon/setting-blue.png')} />
              <Text style={styles.btnText}>Ubah Password</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={logout}>
            <View style={styles.btnRow}>
              <Image source={require('../assets/img/icon/power-yellow.png')} />
              <Text style={styles.btnText}>Keluar</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View >
  )
}

export default Profil

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  header: {
    flex: 0.5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  penImg: {
    position: 'absolute',
    right: 0
  },
  titleText: {
    fontSize: responsiveFontSize(2.3),
    color: color,
    fontWeight: 'bold'
  },
  profileContainer: {
    flex: 1.5,
    flexDirection: 'row',
    padding: 20
  },
  contactContainer: {
    flex: 2.5,
    justifyContent: 'center'
  },
  infoContainer: {
    marginLeft: 25,
    justifyContent: 'center',
    height: 100,
  },
  buttonContainer: {
    flex: 5,
    marginTop: '10%',
    marginHorizontal: 30,
  },
  infoText: {
    fontSize: responsiveFontSize(2.2),
    color: color,
    fontWeight: 'bold'
  },
  nipText: {
    fontSize: responsiveFontSize(1.8),
    color: color,
  },
  profileImg: {
    width: 100,
    height: 100,
    borderRadius: 100
  },
  rowContainer: {
    flexDirection: 'row',
    marginVertical: 10,
    marginHorizontal: 30,
  },
  contactText: {
    color: color,
    marginLeft: 20,
    fontSize: responsiveFontSize(2.2),
    fontWeight: 'bold'
  },
  rekapContainer: {
    flex: 1.8,
    flexDirection: 'row'
  },
  column: {
    width: '50%',
    borderWidth: 0.8,
    borderColor: '#D3E0F3',
    justifyContent: 'center',
    alignItems: 'center'
  },
  jenisText: {
    color: color,
    fontSize: responsiveFontSize(2)
  },
  totalText: {
    fontSize: responsiveFontSize(4.5),
    color: color,
    fontWeight: 'bold'
  },
  btnRow: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center'
  },
  btnText: {
    color: color,
    fontSize: responsiveFontSize(2.2),
    marginLeft: 10,
    fontWeight: 'bold'
  },

  scrollView: {
    flex: 1,
  },
})