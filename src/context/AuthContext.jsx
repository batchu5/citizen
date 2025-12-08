import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { jwtDecode  } from "jwt-decode";
import { loginUser } from "../api/authApi";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (token) {
          const userData = jwtDecode(token);
          setUser(userData);
        } else {
          console.log("No token found");
        }
      } catch (err) {
        console.log("Error decoding token:", err);
        setUser(null);
      }
    };
    loadUser();
  }, []);

  const login = async (email, password) => {
    try {
      console.log("gonna login bro wait");
      const token = await loginUser(email, password);
      if (token) {
        await AsyncStorage.setItem("token", token);
        setUser(jwtDecode(token));
      }
    } catch (err) {
      console.log("Login error:", err);
      throw err; 
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
