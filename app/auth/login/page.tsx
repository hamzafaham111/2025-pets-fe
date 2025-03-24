"use client"
import { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('Attempting login...');
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, { email, password });
      console.log('Login response:', response);
      
      if (response.status === 200) {
        Cookies.set('access_token', response.data.accessToken, { expires: 0.0208, path: '/' });
        Cookies.set('refresh_token', response.data.refreshToken, { expires: 2, path: '/' });
        router.push('/');
      }
    } catch (error: any) {
      console.log('Error details:', {
        status: error.response?.status,
        data: error.response?.data
      });
      
      if (error.response?.status === 403) {
        console.log("403 status detected - User not verified");
        const redirectTo = error.response.data.redirectTo;
        console.log("Verification URL:", redirectTo);
        
        if (redirectTo) {
          console.log("Redirecting to:", redirectTo);
          router.push(redirectTo);
        }
      } else {
        console.error('Login failed:', error);
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <Link href="/auth/forget-password">
              <span className="text-sm text-blue-500 hover:underline mt-2 inline-block">Forgot Password?</span>
            </Link>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition"
          >
            Login
          </button>
        </form>
        <p className="text-center mt-4 text-sm">
          New here?{' '}
          <Link href="/auth/register">
            <span className="text-blue-500 hover:underline">Register</span>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
