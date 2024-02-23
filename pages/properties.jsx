import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const PropertiesPage = () => {
    const router = useRouter();
    const { location } = router.query;
    const [properties, setProperties] = useState([]);
    const [sort, setSort] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [selectedFacilities, setSelectedFacilities] = useState([]);

    const handlePriceChange = (e) => {
        if (e.target.id === 'min-price') {
            setMinPrice(e.target.value);
        } else if (e.target.id === 'max-price') {
            setMaxPrice(e.target.value);
        }
    };

    const fetchProperties = async () => {
        let queryParams = new URLSearchParams();
        if (sort) queryParams.set('sort', sort);
        if (searchTerm) queryParams.set('searchTerm', searchTerm);
        if (minPrice) queryParams.set('minPrice', minPrice);
        if (maxPrice) queryParams.set('maxPrice', maxPrice);
        if (selectedFacilities.length > 0) queryParams.set('facilities', selectedFacilities.join(','));

        try {
            const response = await fetch(`/api/properties/${location}?${queryParams}`);
            if (!response.ok) {
                console.log(queryParams);
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            console.log("Fetched data:", data);
            setProperties(data);
        } catch (error) {
            console.error('Error fetching properties:', error);
        }
    };

    useEffect(() => {
        fetchProperties();
    }, [location, sort, searchTerm, selectedFacilities]);


    const handleSortChange = (e) => {
        setSort(e.target.value);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fetchProperties();
    };
    const handleFacilityChange = (event) => {
        const facility = event.target.name;
        setSelectedFacilities((prevSelectedFacilities) => {
            if (prevSelectedFacilities.includes(facility)) {
                return prevSelectedFacilities.filter((f) => f !== facility);
            } else {
                return [...prevSelectedFacilities, facility];
            }
        });
    };

    return (
        <div className="bg-white min-h-screen p-4">
            <form onSubmit={handleSearchSubmit} className="flex items-center py-2 ml-2 mr-2 text-black">
                <input
                    type="text"
                    placeholder="Search for accommodations..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button type="submit" className="p-2 ml-2 bg-blue-500 text-white rounded-md">Search</button>
            </form>
            <div className="mt-2 ml-2 text-black">
                <label className="block text-black text-sm font-bold mb-2" htmlFor="price-range">
                    Price Range
                </label>
                <div className="flex items-center justify-between gap-4">
                    <div className="flex flex-grow items-center gap-4">
                        <input
                            type="text"
                            id="min-price"
                            placeholder="Min"
                            onChange={handlePriceChange}
                            className="w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <input
                            type="text"
                            id="max-price"
                            placeholder="Max"
                            onChange={handlePriceChange}
                            className="w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={fetchProperties}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Add Filter
                    </button>
                </div>
            </div>

            <div className="flex flex-col ml-2 mt-3">
                <div className="flex items-center mb-2">
                    <span className="text-lg font-bold text-black">Facilitati:</span>
                </div>
                <div className="flex items-center gap-4">
                    <label className="flex items-center space-x-3">
                        <input
                            type="checkbox"
                            name="wifi"
                            checked={selectedFacilities.includes("wifi")}
                            onChange={handleFacilityChange}
                            className="form-checkbox h-5 w-5 text-blue-600"
                        />
                        <span className="text-gray-700 font-medium">
                            WiFi
                        </span>
                    </label>
                    <label className="flex items-center space-x-3">
                        <input
                            type="checkbox"
                            name="accepta animale de companie"
                            checked={selectedFacilities.includes("accepta animale de companie")}
                            onChange={handleFacilityChange}
                            className="form-checkbox h-5 w-5 text-blue-600"
                        />
                        <span className="text-gray-700 font-medium">
                            Animale
                        </span>
                    </label>
                    <label className="flex items-center space-x-3">
                        <input
                            type="checkbox"
                            name="parcare"
                            checked={selectedFacilities.includes("parcare")}
                            onChange={handleFacilityChange}
                            className="form-checkbox h-5 w-5 text-blue-600"
                        />
                        <span className="text-gray-700 font-medium">
                            Parcare
                        </span>
                    </label>
                    <label className="flex items-center space-x-3">
                        <input
                            type="checkbox"
                            name="restaurant"
                            checked={selectedFacilities.includes("restaurant")}
                            onChange={handleFacilityChange}
                            className="form-checkbox h-5 w-5 text-blue-600"
                        />
                        <span className="text-gray-700 font-medium">
                            Restaurant
                        </span>
                    </label>
                </div>
            </div>
            <div className="sorting-select text-black ml-2 mt-3">
                <select value={sort} onChange={handleSortChange} className="p-2 border rounded">
                    <option value="">Default Sorting</option>
                    <option value="rating">Sort by Rating</option>
                    <option value="price">Sort by Price</option>
                    <option value="facilities">Sort by Facilities</option>
                </select>
            </div>

            {properties.map((property) => (
                <Link href={`/accomodations/${property.IDUnitatiCazare}`} key={property.IDUnitatiCazare} className='block border-b last:border-b-0 group'>
                    <div className="flex flex-col md:flex-row items-center p-4 gap-4">
                        <div className="overflow-hidden">
                            <img
                                src={'https://cf.bstatic.com/xdata/images/hotel/square200/141723015.webp?k=1e551238648406bd1c7b52780de8e6aba885d447268c021c3b753a81d207012e&o=' || 'default_image_path.jpg'} // Use default image if not provided
                                alt={`Image of ${property.NumeUnitatiCazare}`}
                                className="transition-transform duration-300 ease-in-out transform group-hover:scale-110"
                            />
                        </div>
                        <div className="w-full md:w-3/4">
                            <h3 className="text-lg font-bold text-black">{property.NumeUnitatiCazare}</h3>
                            <p className="text-gray-600">{property.Locatie}</p>
                            <div className="flex items-center my-2">
                                {/* Replace with actual icons */}
                                <span className="text-yellow-400 mr-2">★</span>
                                <span className='text-black'>
                                    {property.AverageRating && !isNaN(property.AverageRating)
                                        ? Number(property.AverageRating).toFixed(1)
                                        : '0'}
                                </span>
                            </div>
                            {property.FacilitatiDescriere && (
                                <div className="mt-4 text-black">
                                    <h4 className="font-bold">Facilități:</h4>
                                    <p>{property.FacilitatiDescriere}</p>
                                </div>
                            )}

                            {property.CamereInfo && (
                                <div className="mt-4 text-black">
                                    <h4 className="font-bold">Camere:</h4>
                                    {property.CamereInfo.split(';').map((camera, index) => {
                                        const [idCamera, pret] = camera.split(':');
                                        return (
                                            <p key={index} className="mt-1">
                                                Camera {idCamera} - Pret: {pret} RON
                                            </p>
                                        );
                                    })}
                                </div>
                            )}
                            <p className="mt-2 text-gray-600">{property.DescriereUnitatiCazare}</p>
                        </div>
                    </div>
                </Link>
            ))
            }
        </div >
    );
};

export default PropertiesPage;


