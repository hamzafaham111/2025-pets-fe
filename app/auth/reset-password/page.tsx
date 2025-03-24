"use client"
import { use, useState } from 'react';
import Link from 'next/link';
const ResetPassword = () => {
    const [values, setValues] = useState({
        password: "",
        cPassword: ""
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setValues(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleResetPassword = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

    }
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-semibold text-center mb-6">Reset Password</h2>
                <form onSubmit={handleResetPassword}>
                    <div className="mb-4">
                        {/* <label htmlFor="email" className="block text-sm font-medium text-gray-700">Password</label> */}
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
                        {/* <label htmlFor="password" className="block text-sm font-medium text-gray-700">Conform Password</label> */}
                        <input
                            type="password"
                            id="cpassword"
                            value={values.cPassword}
                            name='cPassword'
                            onChange={handleChange}
                            placeholder="conform new password"
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition"
                    >
                        Reset
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
