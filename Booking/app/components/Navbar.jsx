'use client'
import Link from 'next/link';
import UserIcon from './UserIcon';
import { useAuth } from '@Booking/context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    return (
        <nav className="bg-blue-800 w-full">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex justify-between">
                    <div className="flex space-x-4">
                        <div>
                            <Link href="/"
                                className="flex items-center py-5 px-2 text-white">
                                <span className="font-semibold text-xl tracking-tight">Booking.com</span>
                            </Link>
                        </div>
                    </div>
                    {user ? (
                        <div className="flex justify-center items-center">
                            <UserIcon user={user} />
                        </div>
                    ) : (

                        <div className="flex items-center space-x-1">
                            <Link href="/login"
                                className="py-5 px-3 text-white">
                                Login
                            </Link>
                            <Link href="/register"
                                className="py-5 px-3 text-white">
                                Register
                            </Link>
                        </div>
                    )}
                </div>
            </div>

        </nav>
    );
};

export default Navbar;
