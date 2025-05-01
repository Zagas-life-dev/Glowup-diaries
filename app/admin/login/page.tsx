"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const LoginSignupPage = () => {
  const supabase = createClientComponentClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      window.location.href = "/admin/dashboard";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-center">Welcome to Admin Portal</h2>
        <p className="text-center text-gray-600">Please log in or sign up to continue</p>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
          >
            Log In
          </button>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don’t have an account? <a href="../admin/signup" className="text-blue-600 hover:underline">Sign Up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginSignupPage;
