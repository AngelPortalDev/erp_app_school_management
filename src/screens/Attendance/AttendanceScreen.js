// import React, { useState, useRef } from 'react';
// import { View, Text, Image, StyleSheet, TouchableOpacity, Modal, Alert } from 'react-native';
// import { RNCamera } from 'react-native-camera';
// import Geolocation from 'react-native-geolocation-service';

// const AttendanceScreen = () => {
//   const [hasPermission, setHasPermission] = useState(null);
//   const [imageUri, setImageUri] = useState(null);
//   const [location, setLocation] = useState(null);
//   const [clockInTime, setClockInTime] = useState(null);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [isClockedIn, setIsClockedIn] = useState(false);
//   const cameraRef = useRef(null);

//   const openCamera = async () => {
//     const cameraPermission = await RNCamera.requestPermissionsAsync();
//     const locationPermission = await Geolocation.requestAuthorization('whenInUse');

//     if (cameraPermission.status !== 'granted' || locationPermission !== 'granted') {
//       Alert.alert('Permissions required', 'Camera and location permissions are needed.');
//       return;
//     }

//     setHasPermission(true);
//     setModalVisible(true);
//   };

//   const takeSelfieAndClockIn = async () => {
//     if (cameraRef.current) {
//       const photo = await cameraRef.current.takePictureAsync();
//       Geolocation.getCurrentPosition(
//         (position) => {
//           const loc = position.coords;
//           const now = new Date().toLocaleTimeString();

//           setImageUri(photo.uri);
//           setLocation(loc);
//           setClockInTime(now);
//           setIsClockedIn(true);
//           setModalVisible(false);
//         },
//         (error) => {
//           Alert.alert('Location Error', 'Unable to get location.');
//         },
//         { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
//       );
//     }
//   };

//   const handleClockOut = () => {
//     setIsClockedIn(false);
//     setImageUri(null);
//     setClockInTime(null);
//     setLocation(null);
//     Alert.alert('Clocked Out', 'You have successfully clocked out.');
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.heading}>Clock In / Out</Text>

//       {!isClockedIn && (
//         <TouchableOpacity style={styles.clockBtn} onPress={openCamera}>
//           <Text style={styles.btnText}>Clock In</Text>
//         </TouchableOpacity>
//       )}

//       {isClockedIn && (
//         <>
//           <Image source={{ uri: imageUri }} style={styles.image} />
//           <Text style={styles.text}>🕒 Clocked In At: {clockInTime}</Text>
//           <Text style={styles.text}>
//             📍 Location: {location?.latitude.toFixed(4)}, {location?.longitude.toFixed(4)}
//           </Text>
//           <TouchableOpacity style={[styles.clockBtn, styles.clockOut]} onPress={handleClockOut}>
//             <Text style={styles.btnText}>Clock Out</Text>
//           </TouchableOpacity>
//         </>
//       )}

//       {/* Camera Modal */}
//       <Modal visible={modalVisible} animationType="slide">
//         <View style={styles.cameraContainer}>
//           <RNCamera style={styles.camera} ref={cameraRef} type={RNCamera.Constants.Type.front}>
//             <View style={styles.circleFrame}>
//               <TouchableOpacity style={styles.captureBtn} onPress={takeSelfieAndClockIn}>
//                 <Text style={styles.btnText}>Capture & Clock In</Text>
//               </TouchableOpacity>
//             </View>
//           </RNCamera>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// export default AttendanceScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#eef3f9',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   heading: {
//     fontSize: 22,
//     fontWeight: '600',
//     marginBottom: 20,
//     color: '#333',
//   },
//   clockBtn: {
//     backgroundColor: '#4a90e2',
//     paddingVertical: 12,
//     paddingHorizontal: 30,
//     borderRadius: 25,
//     marginTop: 20,
//   },
//   clockOut: {
//     backgroundColor: '#e74c3c',
//   },
//   btnText: {
//     color: '#fff',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
//   image: {
//     width: 200,
//     height: 200,
//     marginVertical: 20,
//     borderRadius: 12,
//   },
//   text: {
//     fontSize: 16,
//     color: '#333',
//     marginBottom: 8,
//   },
//   cameraContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   camera: {
//     flex: 1,
//     width: '100%',
//     height: '100%',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   circleFrame: {
//     width: 200,
//     height: 200,
//     borderRadius: 100,
//     overflow: 'hidden',
//     borderWidth: 5,
//     borderColor: '#fff',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   captureBtn: {
//     backgroundColor: '#4a90e2',
//     padding: 20,
//     borderRadius: 50,
//   },
// });
