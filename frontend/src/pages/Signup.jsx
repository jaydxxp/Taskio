import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

export default function Signup() {
  const navigate = useNavigate();
  const BACKEND = import.meta.env.VITE_BACKEND_URL || "";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [doSubmit, setDoSubmit] = useState(false);

  useEffect(() => {
    if (!doSubmit) return;
    let cancelled = false;

    const run = async () => {
      setError("");
      setSubmitting(true);
      try {
        const url = `${BACKEND}/api/v1/user/signup`;
        const res = await axios.post(url, { name, email, password });
        const token = res?.data?.token;
        if (!token) throw new Error(res?.data?.message || "No token returned");
        localStorage.setItem("token", token);
        if (!cancelled) navigate("/dashboard");
      } catch (err) {
        if (!cancelled) {
          console.error("Signup error", err);
          setError(err?.response?.data?.message || err.message || "Signup failed");
        }
      } finally {
        if (!cancelled) {
          setSubmitting(false);
          setDoSubmit(false);
        }
      }
    };

    run();
    return () => { cancelled = true; };
  }, [doSubmit, name, email, password, BACKEND, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setDoSubmit(true);
  };

  return (
    <>
      <Navbar />
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="text-center text-2xl font-bold tracking-tight text-gray-900">Create your account</h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-900">Name</label>
              <div className="mt-2">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 border outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-900">Email address</label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 border outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-900">Password</label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 border outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>
            </div>

            {error && <div className="text-sm text-red-600">{error}</div>}

            <div>
              <button
                type="submit"
                disabled={submitting}
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
              >
                {submitting ? "Signing up..." : "Sign up"}
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <a href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
              Login
            </a>
          </p>
        </div>
      </div>
    </>
  );
}