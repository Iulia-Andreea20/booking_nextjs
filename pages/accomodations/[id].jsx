'use client'
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import Calendar from '@components/Calendar';
import styles from '@styles/globals.css';
import PopupMessage from '@components/PopupMessage';
import { ro } from 'date-fns/locale';
import React
    from 'react';
const AccomodationsPage = () => {
    const router = useRouter();
    const { id } = router.query;
    // console.log(id)
    const [properties, setProperties] = useState([]);
    const [selectedDates, setSelectedDates] = useState({ startDate: null, endDate: null });
    const [isCalendarVisible, setIsCalendarVisible] = useState(true);
    const [rooms, setRooms] = useState(1);
    const [selectedRoom, setSelectedRoom] = useState('');
    const [IDCamera, setIdCamera] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [unavailableDates, setUnavailableDates] = useState([]);
    const [numarCamere, setNumarCamere] = useState(1);
    const [numarPersoane, setNumarPersoane] = useState(1);
    const [selectedRoom1, setSelectedRoom1] = useState('');
    const [selectedRoom2, setSelectedRoom2] = useState('');

    const handleRoom1Selection = (event) => {
        const newSelectedRoom = event.target.value;
        setSelectedRoom1(newSelectedRoom);
        if (selectedRoom2 === newSelectedRoom) {
            setSelectedRoom2('');
        }
        handleSelectionChange(event); // Call the fetch function here
    };

    const handleRoom2Selection = (event) => {
        const newSelectedRoom = event.target.value;
        setSelectedRoom2(newSelectedRoom);
        if (selectedRoom1 === newSelectedRoom) {
            setSelectedRoom1('');
        }
        handleSelectionChange(event); // Call the fetch function here
    };

    // When rendering the options for Room2, filter out the option that's selected in Room1
    const roomOptionsForRoom2 = Array.isArray(rooms) && rooms.filter(room => room.IDCamera !== selectedRoom1);

    // When rendering the options for Room1, filter out the option that's selected in Room2
    const roomOptionsForRoom1 = Array.isArray(rooms) && rooms.filter(room => room.IDCamera !== selectedRoom2);

    // useEffect(() => {
    //     // Wait until the router is ready before fetching
    //     if (router.isReady && id) {
    //         fetch(`/api/accomodations/${id}`) // Make sure to use the `/api` prefix if it's an API route
    //             .then((res) => {
    //                 if (!res.ok) {
    //                     throw new Error(`HTTP error! Status: ${res.status}`);
    //                 }
    //                 return res.json();
    //             })
    //             .then((data) => {
    //                 // console.log("Fetched data:", data);
    //                 setProperties(Array.isArray(data) ? data : [data]);
    //             })
    //             .catch((error) => {
    //                 console.error('Error fetching properties:', error);
    //             });
    //     }
    // }, [router.isReady, id]);

    // useEffect(() => {
    //     if (id) {
    //         fetch(`/api/rooms/${id}`)
    //             .then(response => response.json())
    //             .then(data => {
    //                 // console.log(data);  /// Log the data to see what's being returned
    //                 setRooms(data);
    //             })
    //             .catch(error => console.error('Error fetching rooms:', error));
    //     }
    // }, [id]);

    useEffect(() => {
        if (router.isReady && id) {
            // const queryParams = new URLSearchParams({
            //     numarCamere: numarCamere,
            //     numarPersoane: numarPersoane
            // }).toString();

            fetch(`/api/accomodations/${id}`)
                .then((res) => {
                    if (!res.ok) {
                        throw new Error(`HTTP error! Status: ${res.status}`);
                    }
                    return res.json();
                })
                .then((data) => {
                    setProperties(Array.isArray(data) ? data : [data]);
                })
                .catch((error) => {
                    console.error('Error fetching properties:', error);

                });
        }
    }, [router.isReady, id]);

    useEffect(() => {
        if (id) {
            const queryParams = new URLSearchParams({
                numarCamere: numarCamere,
                numarPersoane: numarPersoane
            }).toString();

            fetch(`/api/rooms/${id}?${queryParams}`)
                .then(response => response.json())
                .then(data => {
                    setRooms(data);
                })
                .catch(error => console.error('Error fetching rooms:', error));
        }
    }, [id, numarCamere, numarPersoane]);

    const handleDateSelection = (start, end) => {
        setSelectedDates({ startDate: start, endDate: end });
        setIsCalendarVisible(false);
    };

    const formatDateRange = (start, end) => {
        // console.log(start);
        // console.log(end);
        if (start && end) {
            return `${format(start, 'eee d MMM')} — ${format(end, 'eee d MMM')}`;
        }
        return ''; // Return empty string if dates are not selected
    };

    const toggleCalendarVisibility = () => {
        setIsCalendarVisible(!isCalendarVisible);
    };
    const handleChangeInputs = (event) => {
        const { name, value } = event.target;

        // Assuming 'adults' is the name for the numarPersoane input
        // and 'rooms' is the name for the numarCamere input.
        if (name === 'adults') {
            setNumarPersoane(parseInt(value, 10));
        } else if (name === 'rooms') {
            setNumarCamere(parseInt(value, 10));
        }
    };

    const handleSelectionChange = (event) => {
        const newIdCamera = event.target.value;
        setSelectedRoom(newIdCamera);
        setIdCamera(newIdCamera); // This update will not take effect immediately
        console.log("ID Camera: ", newIdCamera)

        // Use newIdCamera directly in the fetch request, since it's the current value
        if (newIdCamera) {
            fetch(`/api/get-unavailable-dates?IDCamera=${newIdCamera}`)
                .then(response => response.json())
                .then(data => {
                    // Assuming the backend returns an array of objects with start and end dates
                    const unavailableDates = data.map(reservation => {
                        const start = new Date(reservation.DataInceputCazare);
                        const end = new Date(reservation.DataSfarsitCazare);
                        const range = [];
                        for (let dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
                            range.push(new Date(dt));
                        }
                        return range;
                    }).flat();
                    setUnavailableDates(unavailableDates); // Update the state with the new unavailable dates
                })
                .catch(error => {
                    console.error('Error fetching unavailable dates:', error);
                });
        } else {
            setUnavailableDates([]); // Clear unavailable dates if no room is selected
        }
    };

    const handleSubmit = async (reservationData) => {
        try {
            const response = await fetch('/api/reservation', {

                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reservationData),
            });

            const data = await response.json();

            if (data.success) {

                console.log('Reservation successful');
            } else {
                console.error('Form submission failed');
            }
        } catch (error) {
            console.error('There was an error submitting the form:', error);
        }
    };

    const handleReservationClick = () => {

        const formatDate = (dateString) => {
            const romanianFormat = format(dateString, 'P', { locale: ro });
            const parts = romanianFormat.split('.');
            const sqlFormatted = `${parts[2]}-${parts[1]}-${parts[0]}`;
            console.log(sqlFormatted)
            if (!sqlFormatted || typeof sqlFormatted !== 'string') {
                return null;
            }

            return sqlFormatted.split('T')[0];
        };
        const IDClient = JSON.parse(localStorage.getItem('user'))
        console.log(IDCamera)
        const reservationData = {
            startDate: selectedDates.startDate ? formatDate(selectedDates.startDate) : null,
            endDate: selectedDates.endDate ? formatDate(selectedDates.endDate) : null,
            IDUnitateCazare: id,
            IDCamera: IDCamera,
            IDClient: IDClient.IdClient,
        };
        localStorage.setItem('reservationData', JSON.stringify(reservationData));

        handleSubmit(reservationData);

        setShowPopup(true);

    }
    return (
        <div>
            {
                properties.map((property) => (
                    <Link href={`/accomodations/${property.IDUnitatiCazare}`} key={property.IDUnitatiCazare} className='block border-b last:border-b-0 group'>
                        <div className="min-h-screen bg-white flex flex-col items-center justify-center">
                            <div className="w-full max-w-md mx-auto">
                                <h1 className="text-2xl font-bold text-center text-black mb-5">{property.NumeUnitatiCazare}</h1>
                                <p className="text-gray-600 text-center">{property.DescriereUnitatiCazare}</p>
                                <div className="mt-4 mb-10">
                                    <img className="mx-auto" src="https://cf.bstatic.com/xdata/images/hotel/square200/141723015.webp?k=1e551238648406bd1c7b52780de8e6aba885d447268c021c3b753a81d207012e&o=" alt="The Council" />
                                </div>
                                <div className="input-container centered-input">
                                    <label className="block text-gray-700 text-sm font-bold text-center ">Persoane</label>
                                    <input
                                        type="number"
                                        name="adults"
                                        value={numarPersoane}
                                        onChange={(e) => handleChangeInputs(e)}
                                        className="input-field shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-3"
                                        min="1"
                                    />
                                </div>
                                <div className="input-container centered-input">
                                    <label className="block text-gray-700 text-sm font-bold text-center">Camere</label>
                                    <input
                                        type="number"
                                        name="rooms"
                                        value={numarCamere}
                                        onChange={(e) => handleChangeInputs(e)}
                                        className="input-field shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-5"
                                        min="1"
                                    />
                                </div>
                            </div>
                            <div className="items-center">
                                {numarCamere >= 1 && (
                                    <select
                                        id="room1"
                                        value={selectedRoom1}
                                        onChange={handleRoom1Selection}

                                        className="bg-blue-500 block w-300 text-gray-700 py-2 px-4 rounded-md shadow-lg bg-white border border-gray-300 hover:border-gray-400 focus:outline-none focus:ring focus:border-blue-300 text-sm mb-5"
                                    >
                                        <option value="">Select a room</option>
                                        {Array.isArray(roomOptionsForRoom1) && roomOptionsForRoom1.map((combination, index) => (
                                            <React.Fragment key={index}>
                                                {combination.Room1ID && (
                                                    <option value={combination.Room1ID}>
                                                        Camera: {combination.Room1ID} | Tip: {combination.Room1Type} | Numar Paturi: {combination.Room1Beds} | Pret/zi: {combination.Room1Price} lei
                                                    </option>
                                                )}
                                                {combination.Room2ID && (
                                                    <option value={combination.Room2ID}>
                                                        Camera: {combination.Room2ID} | Tip: {combination.Room2Type} | Numar Paturi: {combination.Room2Beds} | Pret/zi: {combination.Room2Price} lei
                                                    </option>
                                                )}
                                                {combination.IDCamera && (
                                                    <option key={combination.IDCamera} value={combination.IDCamera}>
                                                        Camera: {combination.IDCamera} | Tip: {combination.TipImobil} | Numar Paturi: {combination.NumarPaturi} | Pret/zi: {combination.Pret} lei
                                                    </option>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </select>
                                )}

                                {numarCamere >= 2 && (
                                    <select
                                        id="room2"
                                        value={selectedRoom2}
                                        onChange={handleRoom2Selection}

                                        className="bg-blue-500 block w-300 text-gray-700 py-2 px-4 rounded-md shadow-lg bg-white border border-gray-300 hover:border-gray-400 focus:outline-none focus:ring focus:border-blue-300 text-sm mb-10"
                                    >
                                        <option value="">Select a room</option>
                                        {Array.isArray(roomOptionsForRoom2) && roomOptionsForRoom2.map((combination, index) => (
                                            <React.Fragment key={index}>
                                                {combination.Room1ID && (
                                                    <option value={combination.Room1ID}>
                                                        Camera: {combination.Room1ID} | Tip: {combination.Room1Type} | Numar Paturi: {combination.Room1Beds} | Pret/zi: {combination.Room1Price} lei
                                                    </option>
                                                )}
                                                {combination.Room2ID && (
                                                    <option value={combination.Room2ID}>
                                                        Camera: {combination.Room2ID} | Tip: {combination.Room2Type} | Numar Paturi: {combination.Room2Beds} | Pret/zi: {combination.Room2Price} lei
                                                    </option>
                                                )}
                                                {combination.IDCamera && (
                                                    <option key={combination.IDCamera} value={combination.IDCamera}>
                                                        Camera: {combination.IDCamera} | Tip: {combination.TipImobil} | Numar Paturi: {combination.NumarPaturi} | Pret/zi: {combination.Pret} lei
                                                    </option>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </select>
                                )}
                            </div>



                            {/* START */}
                            {/* <div className="space-y-4">
                                <div>
                                    <label htmlFor="room1" className="block text-sm font-medium text-gray-700">Room 1</label>
                                    <select
                                        id="room1"
                                        // value={selectedRoom1}
                                        // onChange={handleRoom1Selection}
                                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                    >
                                        <option value="">Select a room</option>
                                        
                                        {Array.isArray(rooms) && rooms.map((room, index) => (
                                            <option key={index} value={room.IDCamera}>
                                                {room.TipImobil} - {room.NumarPaturi} beds - {room.Pret} lei/night
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="room2" className="block text-sm font-medium text-gray-700">Room 2</label>
                                    <select
                                        id="room2"
                                        // value={}
                                        // onChange={handleRoom2Selection}
                                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                    >
                                        <option value="">Select a room</option>
                                       
                                        {Array.isArray(rooms) && rooms.map((room, index) => (
                                            <option key={index} value={room.IDCamera}>
                                                {room.TipImobil} - {room.NumarPaturi} beds - {room.Pret} lei/night
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                
                                <button
                                    // onClick={fetchRoomSuggestions}
                                    className="bg-blue-500 hover:bg-blue-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                >
                                    Get Room Suggestions
                                </button>
                            </div> */}
                            {/* END */}


                            {
                                isCalendarVisible ? (
                                    <Calendar
                                        onSelect={handleDateSelection}
                                        unavailableDates={unavailableDates}
                                    />
                                ) : (
                                    <div className="date-range-display" onClick={toggleCalendarVisibility}>
                                        {selectedDates.startDate && selectedDates.endDate ? formatDateRange(selectedDates.startDate, selectedDates.endDate) : ''}
                                    </div>
                                )
                            }

                            <div className="text-center mt-4">
                                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                                    onClick={handleReservationClick}
                                >
                                    Rezervați acum
                                </button>
                            </div>
                        </div>
                    </Link>
                ))
            }

            {
                showPopup &&
                <PopupMessage
                    message="Rezervarea dumneavoastra a fost realizata cu succes!"
                    // onClose={() => setShowPopup(false)}
                    redirectTo='/reservations'
                />
            }
        </div >
    );
};

export default AccomodationsPage;