import React, { useContext, useState } from "react";
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
import { AuthContext } from "../../context/AuthProvider";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {login, error, isLoading} = useContext(AuthContext)

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
              onChangeText={setPassword}
              value={password}
              placeholder="Password"
              placeholderTextColor="white"
              autoCapitalize="none"
              secureTextEntry={true}
            ></TextInput>
            {error && (
              <Text style={{ color: "red", marginTop: 8 }}>
                {error}
              </Text>
            )}
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => login(email, password)}
            >
              {isLoading && (
                <ActivityIndicator
                  size="small"
                  color="red"
                  style={{ marginRight: 10 }}
                ></ActivityIndicator>
              )}
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
            <View
              style={{
                flexDirection: "row",
                paddingTop: 40,
                paddingBottom: 10,
              }}
            >
              <Text style={{ color: "white" }}>Don't have an account?</Text>
              <TouchableOpacity
                style={{ marginLeft: 5 }}
                onPress={() => navigation.navigate("Register")}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>
                  Register
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
    marginTop: 90,
    backgroundColor: "#1d9bf1",
    paddingTop: 70,
    paddingHorizontal: 90,
    borderRadius: 10,
  },
  inputBox: {
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#fff",
  },
  loginButton: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#fff",
    alignItems: "center",
    borderRadius: 7,
    marginTop: 50,
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
