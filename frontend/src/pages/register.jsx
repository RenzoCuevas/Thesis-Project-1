import { useState } from "react";
import { registerUser } from "../../api/authApi";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();
  
    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault(); // Prevents page refresh
      setError(""); // Reset error message
  
      try {
        console.log("Submitting Form:", formData);
        await registerUser(formData);
        alert("Registration successful!");
        navigate("/login");
      } catch (err) {
        setError(err.message || "Registration failed.");
      }
    };
  
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Register</h2>
          {error && <p className="text-red-500">{error}</p>}
          <input type="text" name="name" placeholder="Name" onChange={handleChange} className="w-full p-2 mb-2 border rounded" required />
          <input type="email" name="email" placeholder="Email" onChange={handleChange} className="w-full p-2 mb-2 border rounded" required />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} className="w-full p-2 mb-4 border rounded" required />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Register</button>
        </form>
      </div>
    );
  }