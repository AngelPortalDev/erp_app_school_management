import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import {getTeacherProfile, updateTeacherProfile} from '../../store/profileSlice';
import { useDispatch, useSelector } from 'react-redux';

const teacherImage =
  'https://stthomasschoolranchi.com/wp-content/uploads/2019/04/t20-5.jpg';


const EditTeacherProfileScreen = ({navigation}) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [mobile, setMobile] = useState('');
  const [username, setUsername] = useState('');
  const [imageUri, setImageUri] = useState(
    ''
  );


  const pickImage = () => {
    const options = {
      mediaType: 'photo',
      maxWidth: 512,
      maxHeight: 512,
      quality: 0.7,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error:', response.errorMessage);
      } else {
        const uri = response.assets && response.assets[0]?.uri;
        if (uri) {
          setImageUri(uri);
        }
      }
    });
  };
  const dispatch = useDispatch();
  const {profile} = useSelector(state=>state.teacher);
  // console.log('profileData',profile);


  useEffect(()=>{
    if(profile){
      setName(profile.first_name  || '');
      setAddress(profile.address || '');
      setMobile(profile.contact_number || '');
      setUsername(profile.username || '');
      setImageUri(
        profile.profile_picture
          ? `http://192.168.1.11:1000${profile.profile_picture}`
          : `${teacherImage}`
      );
    }
  },[profile]);

  const handleSave = () => {

    const updatedData = {
      name,
      address,
      contact_number:mobile,
      username,
      // profile_picture: imageUri,
      profile_picture: imageUri && !imageUri.startsWith('http') ? imageUri : null,

    };
    // console.log('Updated Data:', updatedData);
    // if (imageUri && !imageUri.startsWith('http')) {
    //   updatedData.profile_picture = {
    //     uri: imageUri,
    //     name: 'profile.jpg',
    //     type: 'image/jpeg',
    //   };
    // }
    dispatch(updateTeacherProfile(updatedData))
    .unwrap()
    .then(()=>{
      dispatch(getTeacherProfile());
      Alert.alert(
        'Update Successfully',
        'Profile Updated Successfully...',
        [
          {
            text: 'OK',
            onPress: () => {
              navigation.navigate('TeacherProfile');
            },
          },
        ],
        { cancelable: false }
      );

    })
    .catch(err=>{
      console.log('Update Failed',err?.response?.data || err.message);
    });
  };


  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={pickImage}>
        <Image source={{ uri: imageUri || 'https://stthomasschoolranchi.com/wp-content/uploads/2019/04/t20-5.jpg' }} style={styles.profileImage} />
        <Text style={styles.changePhoto}>Change Photo</Text>
      </TouchableOpacity>

      <TextInput
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <TextInput
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
        style={styles.input}
      />

      <TextInput
        placeholder="Mobile"
        value={mobile}
        onChangeText={setMobile}
        style={styles.input}
        keyboardType="phone-pad"
      />

      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
        keyboardType="default"
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#f7f7f7',
    },
    profileImage: {
      width: 120,
      height: 120,
      borderRadius: 60,
      alignSelf: 'center',
      borderWidth: 3,
      borderColor: '#ff5a5f',
    },
    changePhoto: {
      textAlign: 'center',
      color: '#007bff',
      marginVertical: 10,
    },
    input: {
      backgroundColor: '#fff',
      padding: 12,
      borderRadius: 10,
      marginVertical: 10,
      borderColor: '#ccc',
      borderWidth: 1,
    },
    saveButton: {
      backgroundColor: '#ff5a5f',
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: 'center',
      marginTop: 20,
    },
    saveText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
      },
      backText: {
        marginLeft: 6,
        fontSize: 16,
        color: '#333',
      },
  });

export default EditTeacherProfileScreen;


