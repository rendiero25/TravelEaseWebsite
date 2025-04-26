import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import HeroBg from "../assets/images/hero-bg.png";
import { BiSearchAlt } from "react-icons/bi";
import Button from "@mui/material/Button";

const Hero = ({ categoriesFromIndex = [] }) => {

    const [title, setTitle] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title && !categoryId) {
            setError(true);
            return;
        }
        setError(false)

        // e.preventDefault();
        const searchParams = new URLSearchParams();
        if (title) searchParams.append("title", title);
        if (categoryId) searchParams.append("categoryId", categoryId);
        navigate(`/search-results?${searchParams.toString()}`);
    };

    return(
        <div className="grow px-6 sm:px-12 xl:px-22 3xl:px-42 4xl:px-80 py-2 flex justify-start sm:justify-center xl:justify-start items-center" style={{backgroundImage: `url(${HeroBg})`, backgroundSize: "cover"}}>
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col justify-between items-start gap-4">
                    <h2 className="font-light text-md xl:text-xl text-white">Find out perfect place to hangout in your city</h2>
                    <h1 className="font-bold text-4xl sm:text-5xl xl:text-6xl 3xl:text-7xl text-white sm:mb-4">Discover great places.</h1>

                    <div className="flex flex-col justify-between items-start w-full 4xl:pb-2">
                        <div className="bg-white/75 w-auto py-4 px-10 flex flex-row justify-between items-center gap-2 border-b-[0.03rem] border-white/25">
                            <BiSearchAlt className="size-4 text-black"/>
                            <h4 className="font-normal text-black text-sm">Search</h4>
                        </div>

                        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center bg-white w-full px-6 xl:gap-8 4xl:pb-3">
                            <div className="border-b-[0.03rem] border-black/25 pb-2 pt-10 px-6 w-full">
                                <input type="text"
                                       placeholder={error ? "THIS FIELD IS REQUIRED!" : "Where do you want to go?"}
                                       value={title}
                                       onChange={e => {
                                           setTitle(e.target.value);
                                           if (e.target.value || categoryId) setError(false);
                                       }}
                                       className={`${error ? "placeholder: text-red-900 font-bold text-md outline-none" : "text-black font-normal text-md outline-none"} w-full xl:w-[20rem] 2xl:w-[25rem] 4xl:w-[30rem]`}
                                />
                            </div>

                            <div className="border-b-[0.03rem] border-black/25 pb-2 pt-10 px-6 w-full">
                                <div className="w-full xl:w-[15rem] 4xl:w-[18rem]  border-b-[0.03rem] border-white/25 flex justify-start items-center">
                                    <select value={categoryId}
                                            onChange={e => {
                                                setCategoryId(e.target.value);
                                            if (title || e.target.value) setError(false);}}
                                            className={`w-full ${error ? "text-red-400/78 font-bold text-md" : "text-black/50 text-md outline-none"}`}>
                                                <option value="" className="flex self-end">{error ? "THIS FIELD IS REQUIRED!" : "Categories?"}</option>
                                                {categoriesFromIndex.map(cat => (
                                                    <option value={cat.id} key={cat.id}>{cat.name}</option>
                                                ))}
                                    </select>
                                </div>
                            </div>

                            <div className="py-8 w-full">
                                <Button type="submit" variant="outlined" startIcon={<BiSearchAlt/>} sx={{color:"#FF948D", fontWeight:"400", textTransform:"none", fontSize:"14px", borderWidth:"2px", borderColor:"#FF948D", borderRadius:"50px", padding:"8px 46px"}}>Search</Button>
                            </div>
                        </div>
                    </div>

                    <h2 className="font-light text-md text-white">Popular categories: #indonesia #japan #italy #sweden #southkorea #england #newzealand</h2>
                </div>
            </form>

        </div>
    )
}

export default Hero;