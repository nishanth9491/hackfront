import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const adminEmails = [
    "hostel@gmail.com",
    "academic@gmail.com",
    "administration@gmail.com",
    "newadmin@gmail.com",
  ];

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // New state variable for loading indicator
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [suc, setSuc] = useState(false);
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    if (suc && userId) {
      navigate(`/home/${userId}`);
    }
  }, [suc, userId, navigate]);

  const handleSubmit = async (e) => {
    if (adminEmails.includes(email)) {
      setAdmin(true);
    }
    e.preventDefault();
    try {
      setLoading(true); // Set loading state to true during login request

      const result = await axios.post("https://bend1.onrender.com/login", {
        email,
        password,
        admin,
      });

      console.log(result.data.userId);

      if (result.data.success) {
        setSuc(true);
        setUserId(result.data.userId);
        console.log(result.data.userId);
      } else {
        alert(result.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // Set loading state back to false after login request (success or failure)
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Login
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-600 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              placeholder="Enter Email"
              autoComplete="off"
              name="email"
              className="form-input w-full border rounded focus:outline-none focus:border-blue-500 text-gray-800"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-600 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              placeholder="Enter Password"
              name="password"
              className="form-input w-full border rounded focus:outline-none focus:border-blue-500 text-gray-800"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn btn-success w-full rounded text-black"
            disabled={loading} // Disable the button during loading
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="mt-3 text-center text-gray-600">Don't have an account?</p>
        <Link
          to="/register"
          className="block text-center btn btn-default border w-full bg-light rounded text-decoratio-none text-black mt-2"
        >
          Signup
        </Link>
      </div>
    </div>
  );
};

export default Login;
