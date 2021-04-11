import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator} from "@react-navigation/stack";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Platform, Button, TextInput } from 'react-native';

// expo imports
import * as ImagePicker from 'expo-image-picker'
import * as Sharing from 'expo-sharing'
import * as SplashScreen from 'expo-splash-screen'
import uploadToAnonymousFilesAsync from 'anonymous-files'

// image imports
import logo from './assets/logo.webp'

// Make splash screen display for a bit
SplashScreen.preventAutoHideAsync();
setTimeout(SplashScreen.hideAsync, 3000);

function Home({navigation}) {
  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} />
      <Text style={styles.mainText}>Welcome to the react native demo</Text>
      <Button
        style={styles.button}
        title="Go to image sharing"
        onPress={() => navigation.navigate('Image Sharing')}
      />
      <Button
        style={styles.button}
        title="Login"
        onPress={() => navigation.navigate('Login')}
      />
      <StatusBar style="auto" />
    </View>
  )
}


function SignInScreen() {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  let signIn = (input) => {
    alert(`User: ${input.username} signed in with ${input.password} this is not very good code`)
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.textInput}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Sign in" onPress={() => signIn({ username, password })} />
    </View>
  );
}

function ImageSharingScreen() {
  const [selectedImage, setSelectedImage] = React.useState(null);

  let openShareDialogAsync = async () => {
    if (!(await Sharing.isAvailableAsync())) {
      alert(`The image is available for sharing at: ${selectedImage.remoteUri}`);
      return;
    }

    await Sharing.shareAsync(selectedImage.remoteUri || selectedImage.localUri)
  };

  let openImagePickerAsync = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync();
    if (pickerResult.cancelled === true) {
      return;
    }

    if (Platform.OS === 'web') {
      let remoteUri = await uploadToAnonymousFilesAsync(pickerResult.uri)
      setSelectedImage({ localUri: pickerResult.uri, remoteUri})
    } else {
      setSelectedImage({ localUri: pickerResult.uri, remoteUri: null})
    }
  };

  if (selectedImage !== null) {
    return (
      <View style={styles.container}>
        <Image
          source={{uri: selectedImage.localUri}}
          style={styles.thumbnail} />
        <TouchableOpacity onPress={openShareDialogAsync} >
          <Text style={styles.buttonText}>Share this photo</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={openImagePickerAsync}
        style={styles.button}>
        <Text style={styles.buttonText}>Push me to choose a photo!</Text>
      </TouchableOpacity>
    </View>
  )
}

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Login" component={SignInScreen} />
        <Tab.Screen name="Image Sharing" component={ImageSharingScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flexDirection: 'column',
    height: '25%',
  },
  mainText: {
    color: '#ff0f3f',
    fontSize: 32,
    margin: 30,
  },
  logo: {
    width: 180*2,
    height: 59*2,
    margin: 20,
  },
  button: {
    backgroundColor: 'red',
    margin: 0,
  },
  buttonText: {
    fontSize: 30,
    color: '#ff0',
    borderRadius: 2,
    borderWidth: 4,
  },
  thumbnail: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
  },
  textInput: {
    height: 30,
    width: '50%',
    borderWidth: 2,
    borderRadius: 2,
    color: '#34f',
    backgroundColor: '#bbb'
  }
});
