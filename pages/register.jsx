'use client'
import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '@styles/globals.css'
import Link from 'next/link'

function Register() {
    const [formData, setFormData] = useState({
        Nume: '',
        Prenume: '',
        NumarTelefon: '',
        Email: '',
        Parola: '',
    });

    const router = useRouter();

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
            const response = await fetch('http://localhost:3000/api/register', {

                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data.success) {
                console.log('Registration successful');
                router.push('/login');
            } else {
                console.error('Registration failed:', data.message);
                
            }
        } catch (error) {
            console.error('There was an error submitting the form:', error);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-blue-50">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
                <h2 className="text-2xl font-bold text-center text-gray-700">Booking.com</h2>
                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div>
                        <label htmlFor="nume" className="sr-only">Nume</label>
                        <input
                            id="nume"
                            name="Nume"
                            type="text"
                            required
                            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-black rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Nume"
                            value={formData.nume}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="prenume" className="sr-only">Prenume</label>
                        <input
                            id="prenume"
                            name="Prenume"
                            type="text"
                            required
                            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-black rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Prenume"
                            value={formData.prenume}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="numarTelefon" className="sr-only">Număr de telefon</label>
                        <input
                            id="numarTelefon"
                            name="NumarTelefon"
                            type="tel"
                            required
                            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-black rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Număr Telefon"
                            value={formData.numarTelefon}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="sr-only">Email</label>
                        <input
                            id="email"
                            name="Email"
                            type="email"
                            required
                            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-black rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="parola" className="sr-only">Parolă</label>
                        <input
                            id="parola"
                            name="Parola"
                            type="password"
                            required
                            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-black rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Parolă"
                            value={formData.parola}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mb-2"
                        >
                            Continue
                        </button>
                        <Link href="/login">
                            <button type="button" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-blue-600 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                Log in
                            </button>
                        </Link>
                    </div>
                </form>

            </div>
        </div>
    );
};

export default Register;
