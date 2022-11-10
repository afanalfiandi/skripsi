import { StyleSheet, ActivityIndicator, Image, Text, View, TextInput, TouchableOpacity, Alert, Linking } from 'react-native'
import React, { useEffect, useState } from 'react'
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
const color = '#4E83D2';

const SignIn = () => {
  const [idUser, setId] = useState();
  const [nip, setNip] = useState();
  const [password, setPassword] = useState();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    fetch('https://afanalfiandi.com/attendly/api/api.php?op=login', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nip: nip,
        password: password
      })
    }).then((response) => response.json())
      .then((responseJson) => {
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
          if (responseJson == 'Failed') {
            Alert.alert('', 'NIP atau Password salah!');
          } else {
            const id = responseJson.id;
            AsyncStorage.setItem('userId', id);
            navigation.navigate('Home');
          }
        }, 2500);

      })
      .catch((e) => {
        console.log(e);
      })
  }
  return (
    <View style={styles.container}>
      <View style={styles.imgContainer}>
        <Image source={require('../assets/img/icon/finger-md-blue.png')} />
      </View>
      <Text style={styles.titleText}>Sign In</Text>
      {loading && (
        <ActivityIndicator size="large" style={{
          position: 'absolute',
          alignItems: 'center',
          justifyContent: 'center',
          top: 0,
          bottom: 0,
          right: 0,
          left: 0,
          color: color
        }} />
      )}
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>NIP</Text>
          <TextInput onChangeText={setNip} value={nip} placeholder="Masukkan NIP Anda" style={styles.input}></TextInput>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput onChangeText={setPassword} value={password} secureTextEntry={true} placeholder="Masukkan password Anda" style={styles.input}></TextInput>
        </View>
        <View style={styles.submitContainer}>
          <TouchableOpacity onPress={submit} style={styles.submitBtn}>
            <Text style={styles.submiText}>Masuk</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.footerContainer}>
          <Text style={styles.copyText}>Copyright ©</Text>
          <TouchableOpacity onPress={() => Linking.openURL('https://afanalfiandi.com')}>
            <Text style={styles.ownerText}>afanalfiandi.com</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default SignIn

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white'
  },
  imgContainer: {
    width: responsiveWidth(100),
    height: responsiveHeight(30),
    justifyContent: 'center',
    alignItems: 'center'
  },
  titleText: {
    fontSize: responsiveFontSize(3.5),
    fontWeight: 'bold',
    color: '#4E83D2'
  },
  formContainer: {
    height: responsiveHeight(50),
    width: responsiveWidth(100),
    justifyContent: 'center',
    padding: 20
  },
  inputContainer: {
    marginBottom: 35
  },
  label: {
    fontSize: responsiveFontSize(2),
    color: '#4E83D2',
    fontWeight: 'bold'
  },
  input: {
    borderBottomWidth: 1,
    height: 35,
    borderBottomColor: '#65C8D0',
    color: 'black'
  },
  submitBtn: {
    backgroundColor: '#4E83D2',
    width: responsiveWidth(90),
    height: responsiveHeight(5.5),
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  submitContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  submiText: {
    color: 'white',
    fontWeight: 'bold'
  },
  footerContainer: {
    paddingTop: 25
  },
  copyText: {
    fontWeight: 'bold',
    color: '#B5B5B5'
  },
  ownerText: {
    color: '#F7B44C',
    fontWeight: 'bold'
  }
})