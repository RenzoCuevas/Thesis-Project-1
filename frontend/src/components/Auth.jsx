import { useState } from "react";
import { loginUser, registerUser } from "../../api/authApi";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";

export default function Auth() {
  const [activeTab, setActiveTab] = useState("login"); // 'login', 'register', or 'forgotPassword'
  const [formData, setFormData] = useState({ email: "", password: "", name: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { loginWithToken } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await loginUser({ email: formData.email, password: formData.password });
      if (res.token) {
        await loginWithToken(res.token);
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.message || "Invalid login credentials.");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await registerUser(formData);
      alert("Registration successful! Please log in.");
      setActiveTab("login");
    } catch (err) {
      setError(err.message || "Registration failed.");
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    alert("Password reset instructions sent to your email.");
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-500 to-indigo-600">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setActiveTab("login")}
            className={`px-4 py-2 font-semibold ${
              activeTab === "login" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setActiveTab("register")}
            className={`px-4 py-2 font-semibold ${
              activeTab === "register" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"
            }`}
          >
            Register
          </button>
          <button
            onClick={() => setActiveTab("forgotPassword")}
            className={`px-4 py-2 font-semibold ${
              activeTab === "forgotPassword" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"
            }`}
          >
            Forgot Password
          </button>
        </div>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {activeTab === "login" && (
          <form onSubmit={handleLogin}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              className="w-full p-3 mb-6 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-300"
            >
              Login
            </button>
          </form>
        )}

        {activeTab === "register" && (
          <form onSubmit={handleRegister}>
            <input
              type="text"
              name="name"
              placeholder="Name"
              onChange={handleChange}
              className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              className="w-full p-3 mb-6 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-300"
            >
              Register
            </button>
          </form>
        )}

        {activeTab === "forgotPassword" && (
          <form onSubmit={handleForgotPassword}>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              onChange={handleChange}
              className="w-full p-3 mb-6 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-300"
            >
              Reset Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
}