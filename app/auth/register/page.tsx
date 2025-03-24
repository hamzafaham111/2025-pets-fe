"use client"
import { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/navigation';
const Login = () => {
  const [values, setValues] = useState({
    email: '',
    password: '',
  });
  const router = useRouter();
  const handleChange = (e: React.FormEvent) => {
    const { name, value } = e.target as HTMLInputElement;
    setValues(prev => ({...prev, [name]: value}));
  };

  const handleSubmit = async (e: React.FormEvent) => { 
    e.preventDefault();
    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, values)
    .then(res => {
      console.log({res});
      router.push(res.data.redirectTo)
    })
    .catch(err => {
      console.log({err});
    })
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center mb-6">Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              value={values.email}
              onChange={handleChange}
              name="email"
              placeholder="Enter your email"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              value={values.password}
              onChange={handleChange}
              name="password"
              placeholder="Enter your password"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition"
            type="submit"
          >
            Register
          </button>
        </form>
        <p className="text-center mt-4 text-sm">
          New here?{' '}
          <Link href="/auth/login">
            <span className="text-blue-500 hover:underline">login</span>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
