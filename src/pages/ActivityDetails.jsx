import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";

const ActivityDetails = () => {
    const { id } = useParams();
    const [activity, setActivity] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchActivityDetails = async () => {
            try {
                setLoading(true);
                
                const config = {
                    headers: {
                        'apiKey': '24405e01-fbc1-45a5-9f5a-be13afcd757c'
                    }
                };

                const response = await axios.get(
                    `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/activity/${id}`, 
                    config
                );
                
                setActivity(response.data.data);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch activity details", err);
                setError('Failed to load activity details');
                setLoading(false);
            }
        };

        if (id) {
            fetchActivityDetails();
        }
    }, [id]);

    if (loading) return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <div className="flex-grow flex items-center justify-center">
                <div className="text-2xl">Loading...</div>
            </div>
            <Footer />
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <div className="flex-grow flex items-center justify-center">
                <div className="text-2xl text-red-500">Error: {error}</div>
            </div>
            <Footer />
        </div>
    );

    if (!activity) return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <div className="flex-grow flex items-center justify-center">
                <div className="text-2xl">Activity not found</div>
            </div>
            <Footer />
        </div>
    );

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <div className="flex-grow container mx-auto px-4 py-8">
                <h1 className="text-3xl md:text-4xl font-bold mb-6">{activity.title}</h1>
                
                {/* Image Gallery */}
                <div className="mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {activity.imageUrls && activity.imageUrls.map((url, index) => (
                            <div key={index} className="overflow-hidden rounded-lg shadow-md">
                                <img 
                                    src={url} 
                                    alt={`${activity.title} - image ${index + 1}`} 
                                    className="w-full h-64 object-cover"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "https://media.universalparksusa.com/wp-content/uploads/2024/02/Universal-Studios-Hollywood-globe-entrance-scaled.jpg";
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* Activity Details */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div className="flex flex-wrap justify-between mb-4">
                        <div className="mb-4 md:mb-0">
                            <p className="text-gray-600">Location: {activity.city}, {activity.province}</p>
                            <div className="flex items-center mt-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <span className="ml-1">{activity.rating} Rating</span>
                                <span className="mx-2">•</span>
                                <span>{activity.total_reviews} Reviews</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-lg font-semibold">Price:</p>
                            <p className="text-2xl text-[#F8616C] font-bold">${activity.price}</p>
                        </div>
                    </div>
                    
                    <h2 className="text-xl font-semibold mb-2">Description</h2>
                    <p className="text-gray-700 mb-6">{activity.description}</p>
                    
                    <h2 className="text-xl font-semibold mb-2">Facilities</h2>
                    <div className="mb-6">
                        <ul className="list-disc list-inside space-y-1">
                            {activity.facilities_name && activity.facilities_name.map((facility, index) => (
                                <li key={index} className="text-gray-700">{facility}</li>
                            ))}
                        </ul>
                    </div>
                    
                    <div className="flex justify-center mt-4">
                        <button className="bg-[#F8616C] hover:bg-[#e54b57] text-white font-bold py-3 px-8 rounded-full transition-colors">
                            Book Now
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ActivityDetails;
