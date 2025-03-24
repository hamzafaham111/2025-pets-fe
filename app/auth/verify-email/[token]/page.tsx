"use client"
import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const VerifyEmail = () => {
  const [code, setCode] = useState('');
  const params = useParams();
  const token = params.token as string;
  console.log("token======>>>>",token);
  const router = useRouter();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-email`, { token, code })
    .then(res => {
      console.log(res);
      router.push('/auth/login');
    })
    .catch(err => {
      console.log(err);
    })
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center mb-6">Verify Email</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="code" className="block text-sm font-medium text-gray-700">Code</label>
            <input
              type="text"
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter your code"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>    
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition"
          >
            Verify
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyEmail;
