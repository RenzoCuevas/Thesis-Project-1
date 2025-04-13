import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUserData(token); // Fetch user data on app load if token exists
    }
  }, []);

  const fetchUserData = async (token) => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.user) {
        setUser(data.user); // Set the user data from the backend
      } else {
        logout(); // If no user data, log out
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      logout(); // Log out on error
    }
  };

  const loginWithToken = async (token) => {
    localStorage.setItem("token", token); // Save the token in local storage
    await fetchUserData(token); // Fetch user data after login
  };

  const logout = () => {
    localStorage.removeItem("token"); // Remove the token
    setUser(null); // Clear the user state
    navigate("/login"); // Redirect to login page
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loginWithToken }}>
      {children}
    </AuthContext.Provider>
  );
}