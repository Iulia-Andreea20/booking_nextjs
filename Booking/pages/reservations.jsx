'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@Booking/app/components/Layout';
import Footer from '@Booking/app/components/Footer';
import moment from 'moment-timezone';
import LocationsList from '@Booking/app/components/LocationsList';
import Calendar from '@Booking/app/components/Calendar';
import { ro } from 'date-fns/locale';
import { parseISO, format } from 'date-fns';

const ReservationsPage = () => {
    const [reservations, setReservations] = useState([]);
    const [showLocations, setShowLocations] = useState(false);
    const [showReservationButton, setShowReservationButton] = useState(true);
    const router = useRouter();
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedReservationId, setSelectedReservationId] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [unavailableDates, setUnavailableDates] = useState([]);
    const [selectedDates, setSelectedDates] = useState([null, null]);

    const handleDateSelection = (start, end) => {
        console.log(start)
        console.log(end)
        setSelectedDates([start, end]);
    };

    const handleModifyDates = (reservation) => {
        setShowDatePicker(true);
        setSelectedReservationId(reservation.IdRezervari);
        fetchUnavailableDates(reservation.IdCamera);
    };

    const fetchUnavailableDates = (IdCamera) => {
        fetch(`/api/get-unavailable-dates?IDCamera=${IdCamera}`)
            .then(response => response.json())
            .then(data => {
                const unavailableDates = data.map(reservation => {
                    const start = new Date(reservation.DataInceputCazare);
                    const end = new Date(reservation.DataSfarsitCazare);
                    const range = [];
                    for (let dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
                        range.push(new Date(dt));
                    }
                    return range;
                }).flat();
                setUnavailableDates(unavailableDates);
            })
            .catch(error => {
                console.error('Error fetching unavailable dates:', error);
            });
    };

    const formatDateForDatabase = (dateString) => {
        const romanianFormat = format(dateString, 'P', { locale: ro });
        const parts = romanianFormat.split('.');
        const sqlFormatted = `${parts[2]}-${parts[1]}-${parts[0]}`;
        console.log(sqlFormatted)
        if (!sqlFormatted || typeof sqlFormatted !== 'string') {
            return null;
        }
        console.log(sqlFormatted.split('T')[0])
        return sqlFormatted.split('T')[0];
    };

    const handleSaveChanges = async () => {
        const [startDate, endDate] = selectedDates;
        if (startDate && endDate) {
            try {
                const response = await fetch('/api/update-reservation-dates', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        IdRezervari: selectedReservationId,
                        DataInceputCazare: startDate ? formatDateForDatabase(startDate) : null,
                        DataSfarsitCazare: endDate ? formatDateForDatabase(endDate) : null,
                    }),
                });

                const data = await response.json();
                if (data.success) {
                    setTimeout(() => {
                        setShowPopup(false);
                        fetchReservations();
                        setShowDatePicker(false);
                    }, 3000);
                } else {
                    console.error('Failed to update reservation:', data.message);
                }
            } catch (error) {
                console.error('There was an error updating the reservation:', error);

            }
        }
    };

    const openConfirmDeletePopup = (reservationId) => {
        setShowConfirmDelete(true);
        setSelectedReservationId(reservationId);
    };

    const closeConfirmDeletePopup = () => {
        setShowConfirmDelete(false);
    };

    const confirmDeleteReservation = () => {
        setShowPopup(true);
        setShowConfirmDelete(false);
        console.log(selectedReservationId)
        if (selectedReservationId) {
            deleteReservation(selectedReservationId);
        }

        setTimeout(() => {
            setShowPopup(false);
            fetchReservations();
        }, 3000);
    };
    const formatDate = (dateString) => {
        if (!dateString) {
            return '';
        }
        const date = parseISO(dateString);
        return format(date, 'dd-MM-yyyy');
    };

    const fetchReservations = () => {
        const IdClient = JSON.parse(localStorage.getItem('user')).IdClient;
        if (!IdClient) {
            console.error('No IdClient found in local storage');
            setShowLocations(false);
            return;
        }

        fetch(`/api/display-reservations?IdClient=${IdClient}`)
            .then(response => response.json())
            .then(data => {
                const formattedReservations = data.map(reservation => ({
                    ...reservation,
                    DataInceputCazare: formatDate(reservation.DataInceputCazare),
                    DataSfarsitCazare: formatDate(reservation.DataSfarsitCazare)
                }));
                setReservations(formattedReservations);
            })
            .catch(error => {
                console.error('Error fetching reservations:', error);
            });
    };

    useEffect(() => {
        fetchReservations();
    }, []);

    function poateLasFeedback(rezervare) {
        const dataCurenta = new Date();
        const date = moment(rezervare.DataSfarsitCazare, 'DD-MM-YYYY');
        const formattedDate = date.tz('Europe/Bucharest').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ (z)');
        const dataSfarsitCazare = new Date(formattedDate);
        return dataSfarsitCazare < dataCurenta && rezervare.StatusPlata != 'Cancelled';
    }

    function deschideFormFeedback(reservation) {

        const dataToPass = { IdClient: reservation.IdClient, IdRezervari: reservation.IdRezervari, NumeUnitateCazare: reservation.NumeUnitatiCazare, IdCamera: reservation.IdCamera, DataInceputCazare: reservation.DataInceputCazare, DataSfarsitCazare: reservation.DataSfarsitCazare };
        console.log(reservation)
        console.log(dataToPass)
        router.push({
            pathname: '/feedbackForm',
            query: dataToPass
        });
    }

    const deleteReservation = async (ReservationId) => {
        try {
            const response = await fetch(`/api/delete-reservation`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ IdReservation: ReservationId }),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const data = await response.json();
            if (data.success) {
                setShowPopup(true);
                setTimeout(() => {
                    setShowPopup(false);
                    fetchReservations();
                }, 3000);
            } else {
                console.error('Failed to delete the reservation:', data.message);
            }
        } catch (error) {
            console.error('There was an error deleting the reservation:', error);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <div className="flex-grow">
                {reservations.length > 0 && showReservationButton ? (
                    <div className="flex flex-col items-center justify-center pt-12">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-blue-800">
                                Rezervările dumneavoastră
                            </h2>
                        </div>
                        {reservations.map((reservation) => (
                            <div key={reservation.IdRezervari} className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl mb-5 min-h-[250px]">
                                <div className="p-8 card-container">
                                    <div className=" tracking-wide text-sm  font-semibold">This is a way of making all the cards the s</div>
                                    <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">Rezervarea {reservation.IdRezervari}</div>
                                    <a href="#" className="block mt-1 text-lg leading-tight font-medium text-black hover:underline">{reservation.NumeUnitatiCazare}</a>
                                    <p className="mt-2 text-gray-500">Locatie: {reservation.Locatie}</p>
                                    <p className="text-gray-500">Camera: {reservation.IdCamera}</p>
                                    <p className="text-gray-500">Data inceput: {reservation.DataInceputCazare}</p>
                                    <p className="text-gray-500">Data final: {reservation.DataSfarsitCazare}</p>
                                    <p className="text-gray-500">Check-in: {reservation.Check_in}</p>
                                    <p className="text-gray-500">Check-out: {reservation.Check_out}</p>
                                    <p className="text-gray-500 mb-5">Total de plata: {reservation.PretSejur} RON</p>

                                    {reservation.Feedback ? (
                                        <div className="flex flex-col">
                                            <span className="text-gray-500 font-medium">Feedback:</span>
                                            <div className="border border-gray-300 text-gray-900 text-sm font-medium rounded-md py-2 px-4 bg-gray-100">
                                                {reservation.Feedback}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                                            {poateLasFeedback(reservation) ? (
                                                <button
                                                    className="bg-green-500 text-white py-2 px-4 w-full sm:w-auto flex-grow rounded hover:bg-green-600 focus:outline-none focus:border-green-600 focus:shadow-outline-green active:bg-blue-600 transition ease-in-out duration-150"
                                                    type="button"
                                                    onClick={() => deschideFormFeedback(reservation)}
                                                >
                                                    Lasati Feedback
                                                </button>
                                            ) : (
                                                <>
                                                    <button
                                                        className="bg-red-600 text-white py-2 px-4 w-full sm:w-auto rounded hover:bg-red-700 focus:outline-none focus:border-red-900 focus:shadow-outline-red active:bg-red-900 transition ease-in-out duration-150"
                                                        onClick={() => openConfirmDeletePopup(reservation.IdRezervari)}
                                                    >
                                                        Cancel Reservation
                                                    </button>
                                                    <button
                                                        className="bg-blue-600 text-white py-2 px-4 w-full sm:w-auto rounded hover:bg-blue-700 focus:outline-none focus:border-blue-900 focus:shadow-outline-blue active:bg-blue-900 transition ease-in-out duration-150"
                                                        onClick={() => handleModifyDates(reservation)}
                                                    >
                                                        Modify Dates
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {showDatePicker && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                                <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full mx-4 text-center">
                                    <h2 className="text-lg font-semibold mb-4 text-black">Pick the new date for your reservation:</h2>
                                    <Calendar onSelect={handleDateSelection} unavailableDates={unavailableDates} />
                                    <div className="flex justify-center space-x-4 mt-4">
                                        <button
                                            onClick={() => setShowDatePicker(false)}
                                            className="px-6 py-3 bg-red-500 text-white rounded hover:bg-red-700 transition-colors duration-200"
                                        >
                                            Close
                                        </button>
                                        <button
                                            onClick={handleSaveChanges}
                                            className="px-6 py-3 bg-green-500 text-white rounded hover:bg-green-700 transition-colors duration-200"
                                        >
                                            Save Changes
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}


                        {showConfirmDelete && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                                <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full mx-4">
                                    <p className="text-black text-xl text-center mb-4">Are you sure you want to cancel your reservation?</p>
                                    <div className="flex justify-around mt-4">
                                        <button
                                            onClick={closeConfirmDeletePopup}
                                            className="px-6 py-3 bg-blue-500 text-black rounded hover:bg-blue-700 transition-colors duration-200"
                                        >
                                            No
                                        </button>
                                        <button
                                            onClick={confirmDeleteReservation}
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
                                    <p>Your reservation has been canceled.</p>
                                </div>
                            </div>
                        )}

                        <div className="my-4">
                            <button
                                onClick={() => {
                                    setShowLocations(true);
                                    setShowReservationButton(false);
                                }}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue active:bg-blue-700 transition ease-in-out duration-150"
                            >
                                Make a Reservation
                            </button>
                        </div>
                    </div>
                ) : (
                    reservations.length === 0 && showReservationButton ? (
                        <div className="flex flex-col items-center justify-center flex-grow">
                            <p className="text-black mb-5 mt-5">No reservations found.</p>
                            <button
                                onClick={() => {
                                    setShowLocations(true);
                                    setShowReservationButton(false);
                                }}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue active:bg-blue-700 transition ease-in-out duration-150"
                            >
                                Make a Reservation
                            </button>
                        </div>
                    ) : null
                )}

                {showLocations && (
                    <>
                        <div className="mb-8 text-center">
                            <h2 className="text-2xl font-semibold text-black mt-3">Destinații disponibile</h2>
                            <p className="text-md text-gray-600">Cele mai populare destinații pentru călătorii din România</p>
                        </div>
                        <div className="mb-20">
                            <LocationsList />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ReservationsPage;
