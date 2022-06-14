import "react-native-gesture-handler";
import React, { useContext, useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Login from "./screens/Auth/Login";
import Register from "./screens/Auth/Register";
import Home from "./screens/Home";
import { AuthContext } from "./context/AuthProvider";
import * as SecureStore from "expo-secure-store";
import { ActivityIndicator, View } from "react-native";
import ParentProfile from "./screens/ParentProfile";
import AddKid from "./screens/AddKid";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const DefaultStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home1" component={Home} options={{ headerShown: false }} />
      <Stack.Screen name="Add Kid" component={AddKid} options={{ headerShown: false }} />
    </Stack.Navigator>
  )
}

const AuthStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
    </Stack.Navigator>
  )
}

export default function Root() {
  const { user, setUser } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    SecureStore.getItemAsync("user")
      .then((userData) => {
        if (userData) {
          setUser(JSON.parse(userData));
        }
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color="gray" />
      </View>
    );
  }

  return (
    <>
      {user ? (
        <NavigationContainer>
          <Drawer.Navigator
            initialRouteName="Home"
            screenOptions={{ headerShown: true }}
          >
            <Drawer.Screen name="Home" component={DefaultStackNavigator} />
            <Drawer.Screen name="Profile" component={ParentProfile} />
            <Drawer.Screen name="Add Kid" component={AddKid} />
          </Drawer.Navigator>
        </NavigationContainer>
      ) : (
        <NavigationContainer>
          <AuthStackNavigator />
        </NavigationContainer>
      )}
    </>
  );
}
