import styles from '@styles/globals.css';

const ReservationCard = ({ reservation, onCancel }) => {
    return (
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
            <div className="md:flex">
                <div className="p-8">
                    <div className="absolute top-0 right-0 p-2">
                        <button
                            onClick={onCancel}
                            className="text-black rounded-full bg-red-200 hover:bg-red-300 focus:outline-none"
                        >
                            X
                        </button>
                    </div>
                    <div className="tracking-wide text-sm text-indigo-500 font-semibold">Reservation ID: {reservation.id}</div>
                    <a href="#" className="block mt-1 text-lg leading-tight font-medium text-black hover:underline">Aspect ratio is great</a>
                    <p className="mt-2 text-gray-500">This image has an aspect ratio of 3/2.</p>
                </div>
            </div>
        </div>
    );
};

export default ReservationCard;