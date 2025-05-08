import { useEffect, useState } from "react";
import axios from "axios";
import Pagination from "@mui/material/Pagination";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";

import backgroundImage from "../assets/images/hero-bg.png";

const Promotions = () => {
    const [promos, setPromos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const rowsPerPage = 15;

    useEffect(() => {
        const fetchPromos = async () => {
            try {
                setLoading(true);
                const response = await axios.get(
                    "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/promos",
                    { headers: { apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c" } }
                );
                setPromos(response.data.data || []);
                setLoading(false);
            } catch (err) {
                setError("Failed to fetch promotions");
                setLoading(false);
            }
        };
        fetchPromos();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center mt-20">
                <CircularProgress />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center mt-20">
                <Alert severity="error">{error}</Alert>
            </div>
        );
    }

    // Pagination logic
    const paginatedPromos = promos.slice(
        (page - 1) * rowsPerPage,
        page * rowsPerPage
    );

    return (
        <div className="m-0 p-0 box-border font-primary">
            <div className="w-full h-[15rem] flex flex-col justify-center items-center px-6 pt-10" style={{backgroundImage: `url(${backgroundImage})`, objectFit:"fill"}}>
                <h4 className="text-4xl text-center font-medium mb-2 text-white">Browse Promos for Your Getaway</h4>
                <h4 className="text-lg text-center font-light mb-8 text-white">Whatever your travel plans are, find all the best deals here</h4>
            </div>

            <div className="px-6 py-20 sm:px-12 xl:px-22 3xl:px-42 4xl:px-80 ">
                <div className="flex flex-wrap gap-8 justify-center xl:justify-start">
                    {paginatedPromos.map((promo) => (
                        <div
                            key={promo.id}
                            className="flex flex-col bg-white rounded-lg shadow-md w-full max-w-xs min-w-[260px] flex-1">
                                <img
                                    src={promo.imageUrl || "https://via.placeholder.com/400x180?text=No+Image"}
                                    alt={promo.title}
                                    className="h-44 w-full object-cover rounded-t-lg"
                                    onError={(e) => {
                                        e.target.onerror = null; // prevents looping
                                        e.target.src = "https://media.universalparksusa.com/wp-content/uploads/2024/02/Universal-Studios-Hollywood-globe-entrance-scaled.jpg";
                                    }}
                                />
                                
                            <div className="p-4 flex flex-col flex-1">
                                <h3 className="text-lg font-semibold mb-1">{promo.title}</h3>
                                <p className="text-gray-600 text-sm mb-2">{promo.description}</p>
                                <div className="mt-auto">
                                    <div className="text-sm mb-1"><span className="font-bold">Promo Code:</span> {promo.promo_code}</div>
                                    <div className="text-sm"><span className="font-bold">Discount Price:</span> {promo.promo_discount_price}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-center pt-20 pb-10">
                    <Pagination
                        count={Math.ceil(promos.length / rowsPerPage)}
                        page={page}
                        onChange={(_, value) => setPage(value)}
                        color="primary"
                    />
                </div>
            </div>
        </div>
            
    );
};

export default Promotions;