import { StyleSheet, Text, TouchableOpacity, Image, View, TextInput, Alert } from 'react-native'
import React, { useState } from 'react'
import { responsiveFontSize } from 'react-native-responsive-dimensions'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'

const UbahProfil = () => {

  const navigation = useNavigation();
  const [nama, setNama] = useState();
  const [noHp, setNoHp] = useState();
  const [email, setEmail] = useState();

  const submit = async () => {
    const userId = await AsyncStorage.getItem('userId');

    fetch('https://afanalfiandi.com/attendly/api/api.php?op=ubahAkun', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: userId,
        nama: nama,
        no_hp: noHp,
        email: email
      })
    }).then((response) => response.json())
      .then((responseJson) => {
        if (responseJson == 'Success') {
          Alert.alert('Ubah Profil Alert', 'Ubah Profil Berhasil!', [
            {
              text: 'OK',
              onPress: () => navigation.navigate('Profil')
            }
          ])
        } else {
          Alert.alert('Ubah Profil Alert', 'Ubah Profil Gagal!');
        }
      })

  }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Profil')}>
          <Image source={require('../assets/img/icon/back-blue.png')} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Ubah Profil</Text>
      </View>
      <View style={styles.formContainer}>
        <TextInput placeholder='Nama' style={styles.input} onChangeText={setNama} value={nama} />
        <TextInput placeholder='No HP' style={styles.input} onChangeText={setNoHp} value={noHp} />
        <TextInput placeholder='Email' style={styles.input} onChangeText={setEmail} value={email} />
        <TouchableOpacity style={styles.submitBtn} onPress={submit}>
          <Text style={styles.submitText}>Simpan</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default UbahProfil

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: responsiveFontSize(2.3),
    color: '#4E83D2',
    marginLeft: 20
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#4E83D2',
    color: 'black'
  },
  submitBtn: {
    backgroundColor: '#4E83D2',
    marginTop: 20,
    padding: 12,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  submitText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: responsiveFontSize(2.2)
  }
})