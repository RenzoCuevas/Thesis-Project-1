import { Link } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { useContext, useEffect } from "react";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    if (!user) {
      document.getElementById("navBar").style.display = 'none';
    } else {
      document.getElementById("navBar").style.display = 'flex';
    }
  }, [user]);

  return (
    <nav className="bg-blue-600 text-white flex justify-between items-center" id="navBar">
      <h1 className="px-4 text-2xl font-bold">LMS</h1>
      <div className="space-x-4">
        <table>
          <Link to="/"><th className="p-4 hover:underline hover:bg-blue-900 transition duration-300">Home</th></Link>
          <Link to="/dashboard"><th className="p-4 hover:underline hover:bg-blue-900 transition duration-300">Dashboard</th></Link>
          <Link to="/assignments"> <th className="p-4 hover:underline hover:bg-blue-900 transition duration-300">Assignments</th></Link>
          <Link to="/upload"><th className="p-4 hover:underline hover:bg-blue-900 transition duration-300">Upload</th></Link> 
          <Link to="/register"><th className="p-4 hover:underline hover:bg-blue-900 transition duration-300">Register</th></Link>
          <Link to="/login"><th className="p-4 hover:underline hover:bg-blue-900 transition duration-300">Login</th></Link>
        </table>
      </div>
    </nav>
  );
}
