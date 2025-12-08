import axios from "axios";
import { BASE_URL } from "../utils/constants";

export const createIssue = async (formData, token) => {
  
  console.log("create issue")
  console.log("token", token);
  const data = await axios.post(`${BASE_URL}/issues/`, formData, {
    headers: {
       Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data"
    },
  });
  return data;
};

export const fetchMyIssues = async (token) => {
  const res = await axios.get(`${BASE_URL}/issues/my`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
