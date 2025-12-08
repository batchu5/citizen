import axios from "axios";
import { BASE_URL } from "../utils/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const loginUser = async (email, password) => {
  try {
    console.log("login User in AuthAPI");
    const res = await axios.post(`${BASE_URL}/auth/login`, { email, password });
    console.log("res.data", res.data);
    await AsyncStorage.setItem("userId", res.data.user._id);
    return res.data.token;
  } catch (err) {
    console.error("Login failed:", err.message);
    return null;
  }
};

