import React, { useContext, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Animated,
  SafeAreaView,
  Button,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { AuthContext } from "../context/AuthProvider";
import axiosConfig from "../helpers/axiosConfig";

export default function ParentProfile({navigation}) {
  const [user, setUser] = useState(null);
  const [fname, setFname] = useState(null);
  const [lname, setLname] = useState(null);
  const [username, setUsername] = useState(null);
  const [email, setEmail] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const { user: parent, setUser: setParent, logout } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const fadeOut = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    axiosConfig.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${parent.token}`;
    axiosConfig.get("auth/me").then((response) => {
      setUser(response.data);
      setFname(response.data.fname);
      setLname(response.data.lname);
      setEmail(response.data.email);
      setUsername(response.data.username);
      setPhoneNumber(response.data.phone_number);
      // console.log(user)
    });
  }, []);

  function updateProfile(fname, lname, username, email, phone_number) {
    axiosConfig.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${parent.token}`;
    setIsLoading(true);
    axiosConfig
      .put(`/users/${user.id}`, {
        fname,
        lname,
        email,
        username,
        phone_number,
      })
      .then((response) => {
        const userData = {
          fname: response.data.user.fname,
          lname: response.data.user.lname,
          token: parent.token,
        };
        setParent(userData);
        fadeIn();
        setTimeout(() => {
          fadeOut();
        }, 4000);
        navigation.navigate('Home1')
      })
      .catch((error) => {
        const key = Object.keys(error.response.data.errors[0])[0];
        setError(error.response.data.errors[0][key][0]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={{ fontSize: 32 }}>Update Profile</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={() => logout()}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
      <SafeAreaView>
        <Animated.View style={{ opacity: fadeAnim }}>
          <View style={styles.successView}>
            <Text style={{ color: "green", marginTop: 8 }}>
              Profile Updated
            </Text>
          </View>
        </Animated.View>
      </SafeAreaView>
      <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.inputArea}>
          <TextInput
            style={[styles.inputBox]}
            value={fname}
            onChangeText={setFname}
            placeholder="Enter Your First Name"
            placeholderTextColor="white"
          ></TextInput>
          <TextInput
            style={[styles.inputBox, styles.mt4]}
            value={lname}
            onChangeText={setLname}
            placeholder="Enter Your Last Name"
            placeholderTextColor="white"
          ></TextInput>
          <TextInput
            style={[styles.inputBox, styles.mt4]}
            value={username}
            onChangeText={setUsername}
            placeholder="Enter Your Username"
            placeholderTextColor="white"
          ></TextInput>

          <TextInput
            style={[styles.inputBox, styles.mt4]}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter Your Email"
            placeholderTextColor="white"
            textContentType="emailAddress"
            keyboardType="email-address"
            autoCapitalize="none"
          ></TextInput>
          <TextInput
            style={[styles.inputBox, styles.mt4]}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="Enter Your Phone Number"
            placeholderTextColor="white"
            keyboardType="phone-pad"
          ></TextInput>
          {error && <Text style={{ color: "red", marginTop: 8 }}>{error}</Text>}
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() =>
              updateProfile(fname, lname, username, email, phoneNumber)
            }
          >
            {isLoading && (
              <ActivityIndicator
                size="small"
                color="black"
                style={{ marginRight: 18 }}
              ></ActivityIndicator>
            )}
            <Text style={styles.loginButtonText}>Update Profile</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#5454",
    flex: 1,
    paddingHorizontal: 4,
    paddingVertical: 8,
  },
  userInfoArea: {
    alignItems: "center",
  },
  logoutButton: {
    alignSelf: "center",
    backgroundColor: "#000",
    paddingVertical: 3,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  logoutButtonText: {
    color: "white",
  },
  inputArea: {
    marginTop: 100,
    backgroundColor: "#1d9bf1",
    paddingTop: 30,
    paddingHorizontal: 80,
    borderRadius: 10,
  },
  inputBox: {
    padding: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#fff",
  },
  loginButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 7,
    marginTop: 20,
    marginBottom: 10,
    paddingVertical: 10,
  },
  loginButtonText: {
    color: "red",
    fontSize: 18,
    fontWeight: "bold",
  },
  mt4: {
    marginTop: 16,
  },
});
