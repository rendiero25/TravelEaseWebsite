import { useState, useEffect } from "react";
import axios from "axios";

const TopCategories = () => {

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
                // Make sure we're accessing the data array correctly from the API response
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
        <div className="px-6 sm:px-12 xl:px-22 3xl:px-42 4xl:px-80 h-[42rem] sm:h-[41rem] xl:h-[40rem] 4xl:h-[47rem]">
            <div className="flex flex-col justify-between items-start gap-4">
                <h2 className="font-medium leading-normal text-4xl text-black xl:max-w-lg">Rediscover yourself in Best Place and beyond</h2>
                <div className="border-1 border-gray w-[2rem]"></div>
                <p className="text-lg font-light text-gray xl:max-w-2xl">Rediscover your true essence through profound experiences in the world's finest destinations that transform the way you see life.</p>
            </div>

            <div>
                {categories.map((categorydata) => (
                    <div key={categorydata.id}>
                        <div className="flex flex-col xl:flex-row w-full justify-center items-center pt-10">
                            <div className="w-full flex flex-col xl:flex-row justify-center items-center">
                                <div className="w-full relative flex justify-center items-center h-[27rem] 4xl:h-[30rem]">
                                    <img src={categorydata.imageUrl} alt="categories-image" className="w-full h-full object-cover"/>
                                    <div className="absolute z-10 w-full h-full flex flex-col gap-2 px-6 py-6 justify-end bg-black/55">
                                        <h3 className="text-white font-normal text-3xl">{categorydata.name}</h3>
                                    </div>
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
