// filepath: c:\Users\aim\Desktop\WebDev\Thesis Project\frontend\src\pages\login.jsx
import { useContext, useState } from "react";
import { loginUser } from "../../api/authApi";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { loginWithToken } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser(formData);
      if (res.token) {
        await loginWithToken(res.token);
        navigate("/dashboard");
      } else {
        setError("Invalid login credentials");
      }
    } catch (err) {
      setError(err.message || "An error occurred during login");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-900 to-indigo-600">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Welcome Back
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
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
        <p className="text-center text-gray-600 mt-4">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-500 hover:underline">
            Register
          </a>
        </p>
      </form>
    </div>
  );
}