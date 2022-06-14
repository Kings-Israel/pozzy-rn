import React, { useState, createContext } from "react";
import * as SecureStore from "expo-secure-store";
import axiosConfig from "../helpers/axiosConfig";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <AuthContext.Provider
      value={{
        user,
        error,
        isLoading,
        setUser,
        login: (email, password) => {
          axiosConfig
            .post("/auth/parent_login", { email, password })
            .then((response) => {
              setIsLoading(false);
              const userData = {
                fname: response.data.user.fname,
                lname: response.data.user.lname,
                token: response.data.access_token,
              };
              setUser(userData);
              SecureStore.setItemAsync("user", JSON.stringify(userData));
              setError(null);
              setIsLoading(false);
            })
            .catch((error) => {
              setIsLoading(false);
              const key = Object.keys(error.response.data.errors[0])[0];
              setError(error.response.data.errors[0][key][0]);
            });
        },
        logout: () => {
          axiosConfig.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${user.token}`;
          axiosConfig
            .post(`/logout`)
            .then((response) => {
              setUser(null);
              SecureStore.deleteItemAsync("user");
              setIsLoading(false);
            })
            .catch((error) => {
              setUser(null);
              SecureStore.deleteItemAsync("user");
              setIsLoading(false);
            });
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
