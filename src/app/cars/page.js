'use client';

import { useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { GET_CARS_QUERY } from '../../graphql/mutations';
import client from '../../../lib/apolloClient';
import { getUserFromLocalStorage } from '../../utils'; // adjust path
import { FaUser, FaSignOutAlt } from 'react-icons/fa'; // Import icons

const CarsPage = () => {
    const [page, setPage] = useState(1);
    return <CarsList page={page} setPage={setPage} />;
};

const CarsList = ({ page, setPage }) => {
    const limit = 9;
    const start = (page - 1) * limit;
    const [user, setUser] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        const u = getUserFromLocalStorage();
        setUser(u);
    }, []);

    // ✅ Refetch the data on page change
    const { loading, error, data, refetch } = useQuery(GET_CARS_QUERY, {
        variables: { start, limit },
        client,
        notifyOnNetworkStatusChange: true, // shows loading on refetch
    });

    useEffect(() => {
        refetch({ start, limit });
    }, [page, refetch]);

    const cars = data?.cars || [];

    const handleNext = () => setPage((prev) => prev + 1);
    const handlePrevious = () => {
        if (page > 1) setPage((prev) => prev - 1);
    };

    if (loading && !data) return <div>Loading cars...</div>;
    if (error) return <div>Error loading cars: {error.message}</div>;

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="flex justify-between mb-4">
                {/* "Explore Cars" label on the left */}
                <div className="text-2xl font-bold text-gray-700">Explore Cars</div>

                {user && (
                    <div className="relative">
                        <button
                            className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center text-lg font-semibold"
                            onClick={() => setShowDropdown((prev) => !prev)}
                        >
                            {user.username.slice(0, 2).toUpperCase()}
                        </button>

                        {showDropdown && (
                            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg z-50">
                                <button
                                    className="block w-full px-4 py-2 text-left text-gray-800 hover:bg-gray-100"
                                    onClick={() => {
                                        // navigate to profile page
                                        window.location.href = '/profile';
                                    }}
                                >
                                    <FaUser className="inline mr-2" /> Profile
                                </button>
                                <button
                                    className="block w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100"
                                    onClick={() => {
                                        localStorage.removeItem('user');
                                        window.location.href = '/login';
                                    }}
                                >
                                    <FaSignOutAlt className="inline mr-2" /> Logout
                                </button>
                            </div>
                        )}

                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {cars.length === 0 ? (
                    <p className="text-center text-gray-700">No cars available at the moment.</p>
                ) : (
                    cars.map((car) => (
                        <div className="relative group">
                            {/* Glow behind on hover */}
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 blur-2xl opacity-0 group-hover:opacity-90 scale-105 transition-all duration-700 z-0 group-hover:animate-glow-pulse" />

                            <div
                                key={car.id}
                                className="relative overflow-hidden rounded-xl bg-white/5 backdrop-blur-md shadow-md transition-all duration-300 border border-gray-800/50 hover:shadow-xl hover:scale-[1.02] hover:border-transparent hover:ring-2 hover:ring-purple-500/50 hover:ring-offset-2 hover:ring-offset-black"
                            >

                                {/* Image with bottom blur overlay */}
                                <div className="relative w-full h-56 overflow-hidden">
                                    <img
                                        src={`http://localhost:1337${car.image?.url}` || 'https://via.placeholder.com/300'}
                                        alt={car.name}
                                        className="w-full h-full object-cover"
                                    />

                                    {/* Bottom overlay */}
                                    <div className='absolute bottom-0 left-0 w-full pl-5'>
                                        <h3 className="text-lg font-semibold text-black">{car.name}</h3>
                                        <p className="text-sm text-blue-300">₹{car.price.toLocaleString()}</p>
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="p-4 bg-white">
                                    <p className="text-gray-600 line-clamp-1">{car.description}</p>
                                    {car.specifications && (
                                        <div className="text-gray-500 mt-2 text-sm">
                                            <p>Mileage: {car.specifications.mileage}</p>
                                            <p>Engine: {car.specifications.engine}</p>
                                            <p>Transmission: {car.specifications.transmission}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-8 space-x-4">
                <button
                    onClick={handlePrevious}
                    disabled={page === 1}
                    className="px-4 py-2 bg-blue-500 rounded disabled:opacity-50"
                >
                    Previous
                </button>
                <button className="px-4 py-2 bg-white text-black rounded border">{`Page ${page}`}</button>
                <button
                    onClick={handleNext}
                    disabled={cars.length < limit}
                    className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>

            {/* Floating Action Button */}
            <div className="fixed bottom-8 right-8">
                <button
                    className="w-14 h-14 rounded-full bg-blue-500 text-white flex items-center justify-center text-3xl shadow-lg hover:bg-blue-600 focus:outline-none transition-all duration-300"
                    onClick={() => alert("Add new car")}
                >
                    +
                </button>
            </div>
        </div>
    );
};

export default CarsPage;
