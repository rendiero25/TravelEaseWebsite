import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TopCategories = () => {

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDataTopCategories = async () => {
            try {
                setLoading(true);

                const config = {
                    headers: {
                        'apiKey': '24405e01-fbc1-45a5-9f5a-be13afcd757c'
                    }
                };

                const response = await axios.get("https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/categories", config);
                const topSixCategories = response.data.data.slice(0, 6);

                setCategories(topSixCategories);
                setLoading(false);

            } catch (err) {
                console.error("Failed to fetch activities data from API", err);

                if (err.response && err.response.status === 401) {
                    setError('Authentication failed. Please check your API credentials.');
                } else {
                    setError('Failed to fetch experiences');
                }

                setLoading(false);
            }
        };

        fetchDataTopCategories();
    }, [])

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return(
        <div className="px-6 sm:px-12 xl:px-22 3xl:px-42 4xl:px-80">
            <div className="flex flex-col justify-between items-start gap-4">
                <h2 className="font-medium leading-normal text-4xl text-black xl:max-w-lg">Rediscover yourself in Best Place and beyond</h2>
                <div className="border-1 border-gray w-[2rem]"></div>
                <p className="text-lg font-light text-gray xl:max-w-2xl">Rediscover your true essence through profound experiences in the world's finest destinations that transform the way you see life.</p>
            </div>

            <div className="pt-10 grid grid-cols-1 xl:grid-cols-3 gap-4">
                {categories.map((categorydata) => (
                    <div key={categorydata.id}>
                        <div
                            className="w-full h-full bg-blue-500 cursor-pointer"
                            onClick={() => navigate(`/activities?categoryId=${categorydata.id}`)}
                        >
                            <div className="relative flex justify-center items-center h-[27rem] 4xl:h-[30rem]">
                                <img src={categorydata.imageUrl} alt="categories-image" className="w-full h-full object-cover"/>
                                <div className="absolute w-full h-full flex flex-col gap-2 px-10 py-10 justify-start bg-black/55">
                                    <h3 className="text-white font-normal text-3xl">{categorydata.name}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default TopCategories;
