import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '@styles/globals.css';
const PopupMessage = ({ message, duration = 2000, redirectTo = '/' }) => {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.push(redirectTo);
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, redirectTo, router]);
    return (

        <div className="absolute top-20 w-full px-4">
            <div className="bg-green-500 text-white text-center p-3 rounded shadow">
                <p>{message}</p>
            </div>
        </div>
    );
};

export default PopupMessage;