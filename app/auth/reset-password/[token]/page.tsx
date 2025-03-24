"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useParams } from 'next/navigation';

const ResetPassword = () => {
    const params = useParams();
    const token = params.token as string;
    const [values, setValues] = useState({
        password: "",
        cPassword: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setValues(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (values.password !== values.cPassword) {
            alert("Passwords don't match");
            return;
        }

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`, {
                token,
                newPassword: values.password
            });
            
            if (response.status === 200) {
                alert("Password reset successful");
                window.location.href = '/auth/login';
            }
        } catch (error) {
            console.error('Failed to reset password:', error);
            alert("Failed to reset password. Please try again.");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-semibold text-center mb-6">Reset Password</h2>
                <form onSubmit={handleResetPassword}>
                    <div className="mb-4">
                        <input
                            type="password"
                            id="password"
                            value={values.password}
                            name='password'
                            onChange={handleChange}
                            placeholder="Enter new password"
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <input
                            type="password"
                            id="cpassword"
                            value={values.cPassword}
                            name='cPassword'
                            onChange={handleChange}
                            placeholder="Confirm new password"
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition"
                    >
                        Reset Password
                    </button>
                </form>
                <p className="text-center mt-4 text-sm">
                    Remember your password?{' '}
                    <Link href="/auth/login">
                        <span className="text-blue-500 hover:underline">Login</span>
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default ResetPassword; 