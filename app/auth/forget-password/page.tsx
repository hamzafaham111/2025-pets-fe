"use client"
import { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';

const forgetPassword = () => {
    const [email, setEmail] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, { email });
            if (response.status === 200) {
                alert("Password reset instructions have been sent to your email");
                window.location.href = '/auth/reset-password';
            }
        } catch (error) {
            console.error('Failed to send reset email:', error);
            alert("Failed to send reset email. Please try again.");
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-semibold text-center mb-6">Forgot Password</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
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
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
};

export default forgetPassword;