import { useState } from 'react';
import styles from '@styles/globals.css'
import { useRouter } from 'next/router';
import { useAuth } from '@Booking/context/AuthContext';

const Login = () => {
    const [formData, setFormData] = useState({
        Email: '',
        Parola: '',
    });

    const router = useRouter();
    const { login } = useAuth();
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (response.ok) {
                console.log('Login successful');
                login(data.user);
                router.push('/');
            } else {
                console.error('Login failed:', data.message);
            }
        } catch (error) {
            console.error('There was an error submitting the form:', error);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-blue-50">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
                <h2 className="text-2xl font-bold text-center text-gray-700 mb-5">Booking.com</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="sr-only">Email</label>
                        <input
                            id="email"
                            name="Email"
                            type="email"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="parola" className="sr-only">Password</label>
                        <input
                            id="parola"
                            name="Parola"
                            type="password"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                            placeholder="Password"
                            value={formData.parola}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Log In
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
