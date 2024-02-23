'use client'
import React, { useEffect, useState } from 'react';
import styles from '@styles/globals.css';
import StarRating from '@components/StarRating';
import { useRouter } from 'next/router';

const feedbackForm = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        Feedback: '',
        Rating: '',
        IdClient: '',
        IdRezervari: '',
    });
    const handleRatingSelect = (event) => {
        const selectedRating = event.target.value;

        setFormData(prevFormData => ({
            ...prevFormData,
            Rating: selectedRating 
        }));
        console.log(`Selected rating: ${selectedRating}`);
    }

    const handleFeedbackChange = (event) => {
        const { value } = event.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            Feedback: value 
        }));
    }

    const [dataFields, setDataFields] = useState({
        IdClient: '',
        IdRezervari: '',
        NumeUnitateCazare: '',
        IdCamera: '',
        DataInceputCazare: '',
        DataSfarsitCazare: ''
    });


    useEffect(() => {
        if (router.isReady) {
            const { IdClient, IdRezervari, NumeUnitateCazare, IdCamera, DataInceputCazare, DataSfarsitCazare } = router.query;
            setDataFields({
                IdClient: IdClient || '',
                IdRezervari: IdRezervari || '',
                NumeUnitateCazare: NumeUnitateCazare || '',
                IdCamera: IdCamera || '',
                DataInceputCazare: DataInceputCazare || '',
                DataSfarsitCazare: DataSfarsitCazare || ''
            });
        }

    }, [router.isReady, router.query]);

    useEffect(() => {
        console.log(dataFields);

        setFormData(prevFormData => ({
            ...prevFormData,
            IdClient: dataFields.IdClient,
            IdRezervari: dataFields.IdRezervari
        }));
    }, [dataFields]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:3000/api/insert-feedback', {

                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data.success) {
                console.log('Registration successful');
                console.log(formData)
                router.push('/reservations');
            } else {
                console.error('Registration failed:', data);


            }
        } catch (error) {
            console.error('There was an error submitting the form:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Feedback Form
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Cod rezervare: <span className="font-medium">{dataFields.IdRezervari}</span>
                    </p>
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg mt-4">
                        <div className="px-4 py-5 sm:px-6">
                            <h4 className="text-lg leading-6 font-small text-gray-500">
                                Perioada: {dataFields.DataInceputCazare} / {dataFields.DataSfarsitCazare}
                            </h4>

                        </div>
                        <div className="border-t border-gray-200">
                            <dl>
                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">
                                        Unitate Cazare
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                        {dataFields.NumeUnitateCazare}
                                    </dd>
                                </div>
                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">
                                        Camera
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                        {dataFields.IdCamera}
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </div>
                <form className="mt-8 space-y-6" action="#" method="POST">
                    <input type="hidden" name="reservation_id" value="26" />
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="feedback" className="sr-only">Feedback</label>
                            <textarea
                                id="Feedback"
                                name="Feedback"
                                rows="4"
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Your feedback..."
                                value={formData.Feedback}
                                onChange={handleFeedbackChange}
                            ></textarea>
                        </div>
                    </div>
                    <StarRating
                        name="Rating"
                        value={formData.Rating}
                        onRatingSelect={handleRatingSelect}
                        className="justify-center"
                    />
                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            onClick={handleSubmit}
                        >
                            Submit Feedback
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default feedbackForm;
