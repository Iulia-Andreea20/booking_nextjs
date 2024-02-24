import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from '@styles/globals.css';

const locations = [
    { name: 'Sibiu', image: '/sibiu.jpeg' },
    { name: 'Cluj-Napoca', image: '/cluj-napoca.jpeg' },
    { name: 'Budapesta', image: '/budapesta.jpeg' },
];

const LocationsList = () => {
    return (
        <div className="grid grid-cols-3 gap-4">
            {locations.map((location) => (
                <div className="relative group" key={location.name}>
                    <Link href={`/properties?location=${location.name}`}>
                        <div className="overflow-hidden rounded-lg">
                            <Image
                                src={location.image}
                                alt={location.name}
                                width={350}
                                height={227}
                                layout="responsive"
                                className="transition-transform duration-300 ease-in-out group-hover:scale-110"
                            />
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-opacity-75 bg-black text-white p-2 text-lg font-bold truncate">
                            {location.name}
                        </div>
                    </Link>
                </div>
            ))}
        </div>
    );
};

export default LocationsList;
