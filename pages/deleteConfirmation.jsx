import { useRouter } from 'next/router';
import { useEffect } from 'react';

const DeleteConfirmation = () => {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.push('/');
        }, 2000);

        return () => clearTimeout(timer);
    }, [router]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="bg-red-600 text-center text-white p-3 rounded">
                <p>Your account has been deleted.</p>
            </div>
        </div>
    );
};

export default DeleteConfirmation;