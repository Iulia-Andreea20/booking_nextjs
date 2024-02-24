import Navbar from '@Booking/app/components/Navbar';
import Footer from '@Booking/app/components/Footer';
import styles from '@styles/globals.css';
import StarRating from '@Booking/app/components/StarRating';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { set } from 'date-fns';


export default function Home() {
  const router = useRouter();
  const [properties, setProperties] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRating, setselectedRating] = useState(0);

  const fetchProperties = async () => {
    let queryParams = new URLSearchParams();

    if (searchTerm) queryParams.set('searchTerm', searchTerm);
    if (selectedRating) queryParams.set('selectedRating', selectedRating);
    try {
      const response = await fetch(`/api/home/?${queryParams}`);
      if (!response.ok) {
        console.log(queryParams);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Fetched data:", data);
      setProperties(data);
      console.log(`Selected rating: ${selectedRating}`);
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [searchTerm, selectedRating]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProperties();
  };

  const handleRatingSelect = (event) => {
    const selectedRating = event.target.value;
    setselectedRating(selectedRating);
  }
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
      <div className="text-black ml-3">
        <span>Choose the preferred rating:</span>
        <StarRating
          name="Rating"
          onRatingSelect={handleRatingSelect}
          className="justify-end"
        />
      </div>
      <hr className="border-t border-gray-300" />
      <div className="mt-6 mb-4 mt-5">
        <h2 className="text-2xl font-semibold text-gray-800">Available Locations</h2>
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
    </div>
  );
}
