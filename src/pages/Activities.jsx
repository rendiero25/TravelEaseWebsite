import React, { useEffect, useState } from "react";
import axios from "axios";
import { BiSearchAlt } from "react-icons/bi";
import Button from "@mui/material/Button";

import Header from "../components/Header";
import Footer from "../components/Footer";

const Activities = () => {
    const [allActivities, setAllActivities] = useState([]); // simpan semua data awal
    const [activities, setActivities] = useState([]); // data yg ditampilkan
    const [categories, setCategories] = useState([]);
    const [searchTitle, setSearchTitle] = useState("");
    const [searchCategory, setSearchCategory] = useState("");
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);

    // Fetch all categories
    useEffect(() => {
        async function fetchCategories() {
            try {
                const configCat = {
                    headers: {
                        'apiKey': '24405e01-fbc1-45a5-9f5a-be13afcd757c'
                    }
                };
                const res = await axios.get("https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/categories", configCat);
                setCategories(res.data.data || []);
            } catch {
                setCategories([]);
            }
        }
        fetchCategories();
    }, []);

    // Fetch all activities saat pertama kali mount
    useEffect(() => {
        fetchAllActivities();
    }, []);

    // Mendapatkan seluruh activities dari API
    const fetchAllActivities = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get(
                "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/activities",
                {
                    headers: { 'apiKey': '24405e01-fbc1-45a5-9f5a-be13afcd757c' }
                }
            );
            setAllActivities(res.data.data || []);
            setActivities(res.data.data || []);
        } catch {
            setError("Failed to load activities");
            setAllActivities([]);
            setActivities([]);
        }
        setLoading(false);
    };

    // Handle search form submit (local filtering)
    const handleSearch = (e) => {
        e.preventDefault();
        if (!searchTitle && !searchCategory) {
            setError(true);
            return;
        }
        setError(false);
        let filtered = allActivities;
        if (searchTitle) {
            filtered = filtered.filter(act => act.title.toLowerCase().includes(searchTitle.toLowerCase()));
        }
        if (searchCategory) {
            filtered = filtered.filter(act => act.category && act.category.id === searchCategory);
        }
        setActivities(filtered);
    };

    // Reset behavior, jika user klik Reset
    const handleReset = () => {
        setSearchTitle("");
        setSearchCategory("");
        setError(false);
        setActivities(allActivities);
    };

    return (
        <div className="m-0 p-0 box-border font-primary">
            <Header />

            <div className="px-6 sm:px-12 xl:px-22 3xl:px-42 4xl:px-80">
                <div>
                    <div className="py-10 flex flex-col xl:flex-row justify-between items-center xl:items-start">
                        <div>
                            {loading && <div className="text-center py-16">Loading activities...</div>}
                            {error && !loading && (<div className="text-center py-4 text-red-600">{error}</div>)}

                            {!loading && !error && (
                                <div className="w-full max-w-4xl">
                                    {activities.length === 0 ? (
                                        <div className="text-center py-16">No activities found.</div>
                                    ) : (
                                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {activities.map(act => (
                                                <li key={act.id} className="bg-white rounded-xl shadow p-5 flex flex-col gap-2">
                                                    <img
                                                        src={act.imageUrls?.[0] || "https://via.placeholder.com/300x200?text=No+Image"}
                                                        alt={act.title}
                                                        className="w-full h-48 object-cover rounded-lg mb-3"
                                                    />
                                                    <h3 className="font-bold text-lg">{act.title}</h3>
                                                    <div className="text-gray-500 text-sm">{act.category?.name}</div>
                                                    <div className="text-gray-400 text-xs">By: {act.createdBy || "-"}</div>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="min-h-full w-2 border-[0.03rem] border-black/25"></div>

                        <div>
                            <form onSubmit={handleSearch} className="w-full bg-white shadow p-6 rounded flex flex-col gap-6 mb-10">
                                <div className="flex-1">
                                    <label className="block text-gray-700 mb-2">Search Title</label>
                                    <input type="text" placeholder={error ? "THIS FIELD IS REQUIRED!" : "Where do you want to go?"}
                                        className={`w-full border p-2 rounded-md outline-none ${error && !searchTitle && !searchCategory ? "border-red-500" : "border-gray-300"}`}
                                        value={searchTitle}
                                        onChange={e => {
                                            setSearchTitle(e.target.value);
                                            if (error) setError(null);
                                        }}
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-gray-700 mb-2">Category</label>
                                    <select
                                        value={searchCategory}
                                        onChange={e => {
                                            setSearchCategory(e.target.value);
                                            if (error) setError(null);
                                        }}
                                        className={`w-full border p-2 rounded-md outline-none ${error && !searchTitle && !searchCategory ? "border-red-500" : "border-gray-300"}`}>
                                            <option value="">{error ? "THIS FIELD IS REQUIRED!" : "Choose category"}</option>
                                                {categories.map(cat => (
                                                    <option value={cat.id} key={cat.id}>{cat.name}</option>
                                                ))}
                                    </select>
                                </div>
                                <div className="flex gap-2">
                                    <Button type="submit" variant="outlined" startIcon={<BiSearchAlt />}
                                        sx={{color: "#FF948D", fontWeight: 600, textTransform: "none", fontSize: "15px", borderWidth: "2px", borderColor: "#FF948D", borderRadius: "50px", px: 4, py: 1.5,}}>
                                            Search
                                    </Button>

                                    <Button type="button" variant="text" onClick={handleReset} sx={{color: "#777", textTransform: "none", fontSize: "15px", px: 2, py: 1.5,}}>
                                        Reset
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}

export default Activities;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { BiSearchAlt } from "react-icons/bi";
// import Button from "@mui/material/Button";
//
// import Header from "../components/Header";
// import Footer from "../components/Footer";
//
// const Activities = () => {
//     const [activities, setActivities] = useState([]);
//     const [categories, setCategories] = useState([]);
//     const [searchTitle, setSearchTitle] = useState("");
//     const [searchCategory, setSearchCategory] = useState("");
//     const [error, setError] = useState(false);
//     const [loading, setLoading] = useState(true);
//
//     // Fetch all categories
//     useEffect(() => {
//         async function fetchCategories() {
//             try {
//                 const configCat = {
//                     headers: {
//                         'apiKey': '24405e01-fbc1-45a5-9f5a-be13afcd757c'
//                     }
//                 };
//
//                 const res = await axios.get("https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/categories", configCat);
//                 setCategories(res.data.data || []);
//
//             } catch {
//                 setCategories([]);
//             }
//         }
//         fetchCategories();
//     }, []);
//
//     // Fetch all activities (default and after reset, or with params)
//     const fetchActivities = async (params = {}) => {
//         setLoading(true);
//         setError(null);
//         try {
//             const res = await axios.get(
//                 "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/activities",
//                 {
//                     headers: { 'apiKey': '24405e01-fbc1-45a5-9f5a-be13afcd757c' },
//                     params: params // <--- penting! biar pencarian/semua data dari API bisa berjalan
//                 }
//             );
//             setActivities(res.data.data || []);
//         } catch {
//             setError("Failed to load activities");
//             setActivities([]);
//         }
//         setLoading(false);
//     };
//
//     // Initial fetch on mount (show all)
//     useEffect(() => {
//         fetchActivities();
//     }, []);
//
//     // Handle search form submit
//     const handleSearch = (e) => {
//         e.preventDefault();
//         if (!searchTitle && !searchCategory) {
//             setError(true);
//             return;
//         }
//         setError(false);
//         const params = {};
//         if (searchTitle) params.name = searchTitle;
//         if (searchCategory) params.categoryId = searchCategory;
//         fetchActivities(params); // akan lewat ke params axios
//     };
//
//     // Reset behavior, jika user klik Reset
//     const handleReset = () => {
//         setSearchTitle("");
//         setSearchCategory("");
//         setError(false);
//         fetchActivities();
//     };
//
//     return (
//         <div className="m-0 p-0 box-border font-primary">
//             <Header />
//
//             <div className="px-6 sm:px-12 xl:px-22 3xl:px-42 4xl:px-80">
//                 <div>
//                     <div className="min-h-screen flex flex-col items-center px-4 py-10 bg-gray-50">
//                         {/* SEARCH SECTION */}
//                         <form onSubmit={handleSearch} className="w-full max-w-3xl bg-white shadow p-6 rounded flex flex-col xl:flex-row xl:items-end gap-6 mb-10">
//                             <div className="flex-1">
//                                 <label className="block text-gray-700 mb-2">Search Title</label>
//                                 <input
//                                     type="text"
//                                     placeholder={error ? "THIS FIELD IS REQUIRED!" : "Where do you want to go?"}
//                                     className={`w-full border p-2 rounded-md outline-none ${error && !searchTitle && !searchCategory ? "border-red-500" : "border-gray-300"}`}
//                                     value={searchTitle}
//                                     onChange={e => {
//                                         setSearchTitle(e.target.value);
//                                         if (error) setError(null);
//                                     }}
//                                 />
//                             </div>
//                             <div className="flex-1">
//                                 <label className="block text-gray-700 mb-2">Category</label>
//                                 <select
//                                     value={searchCategory}
//                                     onChange={e => {
//                                         setSearchCategory(e.target.value);
//                                         if (error) setError(null);
//                                     }}
//                                     className={`w-full border p-2 rounded-md outline-none ${error && !searchTitle && !searchCategory ? "border-red-500" : "border-gray-300"}`}
//                                 >
//                                     <option value="">{error ? "THIS FIELD IS REQUIRED!" : "Choose category"}</option>
//                                     {categories.map(cat => (
//                                         <option value={cat.id} key={cat.id}>{cat.name}</option>
//                                     ))}
//                                 </select>
//                             </div>
//                             <div className="flex gap-2">
//                                 <Button
//                                     type="submit"
//                                     variant="outlined"
//                                     startIcon={<BiSearchAlt />}
//                                     sx={{
//                                         color: "#FF948D",
//                                         fontWeight: 600,
//                                         textTransform: "none",
//                                         fontSize: "15px",
//                                         borderWidth: "2px",
//                                         borderColor: "#FF948D",
//                                         borderRadius: "50px",
//                                         px: 4,
//                                         py: 1.5,
//                                     }}
//                                 >
//                                     Search
//                                 </Button>
//                                 <Button
//                                     type="button"
//                                     variant="text"
//                                     onClick={handleReset}
//                                     sx={{
//                                         color: "#777",
//                                         textTransform: "none",
//                                         fontSize: "15px",
//                                         px: 2,
//                                         py: 1.5,
//                                     }}
//                                 >
//                                     Reset
//                                 </Button>
//                             </div>
//                         </form>
//
//                         {/* LOADING & ERROR */}
//                         {loading && <div className="text-center py-16">Loading activities...</div>}
//                         {error && !loading && (
//                             <div className="text-center py-4 text-red-600">{error}</div>
//                         )}
//
//                         {/* RESULTS */}
//                         {!loading && !error && (
//                             <div className="w-full max-w-4xl">
//                                 {activities.length === 0 ? (
//                                     <div className="text-center py-16">No activities found.</div>
//                                 ) : (
//                                     <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                         {activities.map(act => (
//                                             <li key={act.id} className="bg-white rounded-xl shadow p-5 flex flex-col gap-2">
//                                                 <img src={act.imageUrls?.[0]} alt={act.title} className="w-full h-48 object-cover rounded-lg mb-3" />
//                                                 <h3 className="font-bold text-lg">{act.title}</h3>
//                                                 <div className="text-gray-500 text-sm">{act.category?.name}</div>
//                                                 <div className="text-gray-400 text-xs">By: {act.createdBy || "-"}</div>
//                                             </li>
//                                         ))}
//                                     </ul>
//                                 )}
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>
//
//             <Footer />
//         </div>
//     )
// }
//
// export default Activities;