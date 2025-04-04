import { Link } from "react-router-dom";
import './App.css';

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">LMS</h1>
      <div className="space-x-4">
        <Link to="/" className="hover:underline navContents">Home</Link>
        <Link to="/dashboard" className="hover:underline navContents">Dashboard</Link>
        <Link to="/upload" className="hover:underline navContents">Upload</Link> 
        <Link to="/register" className="hover:underline navContents">Register</Link>
        <Link to="/login" className="hover:underline navContents">Login</Link>
      </div>
    </nav>
  );
}
