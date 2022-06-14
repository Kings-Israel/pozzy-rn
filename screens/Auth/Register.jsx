import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import axiosConfig from "../../helpers/axiosConfig";

export default function Register({ navigation }) {
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  function register(fname, lname, username, email, phoneNumber, password) {
    setIsLoading(true);
    axiosConfig
      .post("/auth/parent_register", {
        fname,
        lname,
        username,
        email,
        phoneNumber,
        password,
      })
      .then((response) => {
        setIsLoading(false);
        console.log(response.data);
      })
      .catch((error) => {
        setIsLoading(false);
        const key = Object.keys(error.response.data.errors[0])[0];
        setError(error.response.data.errors[0][key][0]);
      });
  }

  return (
    <View style={styles.container}>
      <View style={{ marginTop: 130 }}>
        <View style={{ alignItems: "center" }}>
          <Image
            style={styles.logo}
            source={require("../../assets/pozzy.png")}
          ></Image>
        </View>
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
            <TextInput
              style={[styles.inputBox, styles.mt4]}
              onChangeText={setPassword}
              value={password}
              placeholder="Password"
              placeholderTextColor="white"
              autoCapitalize="none"
              secureTextEntry={true}
            ></TextInput>
            {error && (
              <Text style={{ color: "red", marginTop: 8 }}>{error}</Text>
            )}
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => register(fname, lname, username, email, password)}
            >
              {isLoading && (
                <ActivityIndicator
                  size="small"
                  color="black"
                  style={{ marginRight: 18 }}
                ></ActivityIndicator>
              )}
              <Text style={styles.loginButtonText}>Register</Text>
            </TouchableOpacity>
            <View
              style={{
                flexDirection: "row",
                paddingTop: 30,
                paddingBottom: 10,
              }}
            >
              <Text style={{ color: "white" }}>Already have an account?</Text>
              <TouchableOpacity
                style={{ marginLeft: 5 }}
                onPress={() => navigation.navigate("Login")}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>
                  Login
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#1d9bf1",
    alignItems: "center",
  },
  logo: {
    width: 250,
    height: 120,
    resizeMode: "center",
  },
  inputArea: {
    marginTop: 20,
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
