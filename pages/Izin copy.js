import { StyleSheet, Dimensions, TextInput, TouchableOpacity, Image, Text, View, Alert } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import AsyncStorage from '@react-native-async-storage/async-storage';
var height = Dimensions.get('window').height;
var width = Dimensions.get('window').width;

var radio_props = [
    { label: 'Sakit', value: 1 },
    { label: 'Izin', value: 2 },
    { label: 'Lain - lain', value: 3 }
];
const Izin = () => {

    const [value, setValue] = useState();
    const [keterangan, setKeterangan] = useState();
    const navigation = useNavigation();

    const onSubmit = async () => {
        const userId = await AsyncStorage.getItem('userId');

        fetch('https://afanalfiandi.com/attendly/api/api.php?op=addizin', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: userId,
                izin: value,
                keterangan: keterangan
            })
        }).then((response) => response.json())
            .then((responseJson) => {
                if (responseJson == 'Success') {
                    Alert.alert('Status Izin', 'Izin Berhasil!', [
                        {
                            text: "OK", onPress: () => navigation.navigate('Home')
                        }
                    ])
                }
            }).catch((e) => {
                console.log(e);
            })
    }
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                    <Image source={require('../assets/img/icon/back-blue.png')} />
                </TouchableOpacity>
                <Text style={styles.headerText}>Izin</Text>
            </View>
            <View style={styles.formContainer}>
                <Text style={styles.formTitle}>Izin</Text>
                <RadioForm
                    animation={true}
                    formHorizontal={false}
                    labelHorizontal={true}
                >
                    {
                        radio_props.map((obj, i) => (
                            <RadioButton labelHorizontal={true} key={i} style={{ backgroundColor: 'white', padding: 10, justifyContent: 'space-between', borderRadius: 5, marginTop: 20 }}>
                                <RadioButtonLabel
                                    obj={obj}
                                    index={i}
                                    labelHorizontal={true}
                                    onPress={(value) => setValue(value)}
                                    labelStyle={{ fontSize: 16, color: '#4E83D2' }}
                                    labelWrapStyle={{}}
                                />
                                <RadioButtonInput
                                    obj={obj}
                                    index={i}
                                    isSelected={value === i + 1}
                                    onPress={(value) => setValue(value)}
                                    borderWidth={1}
                                    buttonInnerColor={'#4E83D2'}
                                    buttonOuterColor={value === i ? '#4E83D2' : '#4E83D2'}
                                    buttonSize={10}
                                    buttonOuterSize={20}
                                    buttonWrapStyle={{ marginLeft: 10 }}
                                />
                            </RadioButton>
                        ))
                    }
                </RadioForm>

                <Text style={styles.formTitle}>Keterangan</Text>
                <TextInput
                    multiline={true}
                    numberOfLines={10}
                    style={styles.ketInput}
                    onChangeText={setKeterangan}
                    value={keterangan}
                />
            </View>

            <View style={styles.submitContainer}>
                <TouchableOpacity style={styles.submitBtn} onPress={onSubmit}>
                    <Text style={styles.submitText}>Simpan</Text>
                </TouchableOpacity>
            </View>
        </View>

    )
}

export default Izin

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
        width: width,
        height: height
    },
    header: {
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center'
    },
    headerText: {
        fontWeight: 'bold',
        // fontSize: responsiveFontSize(2.3),
        color: '#4E83D2',
        marginLeft: 20
    },
    formContainer: {
        backgroundColor: '#F6EAEA',
        // width: responsiveScreenWidth(100),
        height: height * 0.7,
        padding: width * 0.04,
    },
    formTitle: {
        fontSize: 18,
        marginTop: 10,
        color: '#3F69A6',
        fontWeight: 'bold'
    },
    ketInput: {
        textAlignVertical: 'top',
        backgroundColor: 'white',
        borderRadius: 5,
        padding: 10,
        marginTop: 10,
        color: 'black'
    },
    submitContainer: {
        padding: 20,
        // marginTop: responsiveHeight(20),
        width: '100%',
    },
    submitBtn: {
        backgroundColor: '#4E83D2',
        paddingVertical: 13,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5
    },
    submitText: {
        fontWeight: 'bold',
        color: 'white',
        fontSize: 18
    }
})