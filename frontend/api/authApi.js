import axios from "axios";

const API_URL = "http://localhost:5000/api/auth"; // Backend URL

// Register User
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Login User
export const loginUser = async (formData) => {
  const response = await axios.post("http://localhost:5000/api/auth/login", formData);
  return response.data; // Ensure this returns the token
};
