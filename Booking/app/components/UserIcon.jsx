// components/UserIcon.jsx
import styles from '@styles/globals.css';
import { useAuth } from '@Booking/context/AuthContext';
import { useState, useRef, useEffect } from 'react';
import { FaLock, FaSignOutAlt, FaTrashAlt, FaSuitcase } from 'react-icons/fa';

const UserIcon = ({ user }) => {
    const getUserInitials = (name) => {
        return name
            .split(' ')
            .map((part) => part[0])
            .join('')
            .toUpperCase();
    };

    const handleLogout = () => {
        logout();
        setMenuOpen(false);
    };
    const [showPopup, setShowPopup] = useState(false);

    const { logout } = useAuth();
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [menuRef]);

    const handleDeleteAccount = () => {
        setShowConfirmDelete(true);
    };

    const confirmDeleteAccount = () => {
        const userString = localStorage.getItem('user');
        const userObject = JSON.parse(userString);
        const Email = userObject.Email;

        setShowConfirmDelete(false);
        deleteAccount(Email);

        onAccountDeleted();

        console.log("Account deletion confirmed");
    };
    const deleteAccount = async (Email) => {
        try {
            console.log(Email);
            const response = await fetch('http://localhost:3000/api/delete-account', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ Email: Email }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.removeItem('user');
            } else {
                console.error('Failed to delete account:', data.message);
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    const onAccountDeleted = () => {
        setShowPopup(true);

        setTimeout(() => {
            setShowPopup(false);
            logout();
        }, 2000);
    };
    return (

        <div className="relative" ref={menuRef}>
            <div
                className="flex justify-center items-center h-12 w-12 rounded-full bg-gray-200 text-blue-500 cursor-pointer"
                onClick={() => setMenuOpen((prev) => !prev)}
            >
                <span className="text-xl font-medium">{getUserInitials(user.Nume)}</span>
            </div>
            {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl z-20">
                    <a href="/UpdatePassword" className="block px-4 py-2 text-sm capitalize text-gray-700 hover:bg-blue-500 hover:text-white flex items-center">
                        <FaLock className="mr-3" /> Update Password
                    </a>
                    <a href="/" onClick={handleLogout} className="block px-4 py-2 text-sm capitalize text-gray-700 hover:bg-blue-500 hover:text-white flex items-center">
                        <FaSignOutAlt className="mr-3" /> Logout
                    </a>
                    <a href="/reservations" className="block px-4 py-2 text-sm capitalize text-gray-700 hover:bg-blue-500 hover:text-white flex items-center">
                        <FaSuitcase className="mr-3" /> Reservation
                    </a>
                    <button
                        onClick={() => setShowConfirmDelete(true)}
                        className="block w-full text-left px-4 py-2 text-sm capitalize text-black hover:bg-red-500 hover:text-white flex items-center"
                    >
                        <FaTrashAlt className="mr-3" /> Delete Account
                    </button>
                </div>
            )}

            {showConfirmDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full mx-4">
                        <p className="text-black text-xl text-center mb-4">Are you sure you want to delete your account?</p>
                        <div className="flex justify-around mt-4">
                            <button
                                onClick={() => setShowConfirmDelete(false)}
                                className="px-6 py-3 bg-blue-500 text-black rounded hover:bg-blue-700 transition-colors duration-200"
                            >
                                No
                            </button>
                            <button
                                onClick={confirmDeleteAccount}
                                className="px-6 py-3 bg-red-500 text-black rounded hover:bg-red-700 transition-colors duration-200"
                            >
                                Yes
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {showPopup && (
                <div className="fixed top-[64px] left-0 right-0 z-50">
                    <div className="bg-red-600 text-center text-white p-3">
                        <p>Your account has been deleted.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserIcon;

