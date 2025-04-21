import HeroBg from "../assets/images/hero-bg.png";
import {BiRightArrowCircle, BiSearchAlt} from "react-icons/bi";
import Button from "@mui/material/Button";

const Hero = () => {
    return(
        <div className="grow px-6 xl:px-22 3xl:px-42 4xl:px-80 py-2 flex justify-start items-center" style={{backgroundImage: `url(${HeroBg})`}}>
            <div className="flex flex-col justify-between items-start gap-4">
                <h2 className="font-light text-md xl:text-xl text-white">Find out perfect place to hangout in your city</h2>
                <h1 className="font-bold text-4xl 3xl:text-7xl text-white">Discover great places.</h1>

                <div className="flex flex-col justify-between items-start w-full">
                    <div className="bg-white w-auto py-4 px-10 flex flex-row justify-between items-center gap-2 border-b-[0.03rem] border-white/25">
                        <BiSearchAlt className="size-4 text-black"/>
                        <h4 className="font-light text-black text-sm">Search</h4>
                    </div>

                    <div className="flex flex-col xl:flex-row justify-between items-start bg-white w-full px-6">
                        <div className="border-b-[0.03rem] border-black/25 pb-2 pt-10 px-6 w-full">
                            <input type="text" name="" id="" placeholder="What are you looking for?" className="placeholder:text-black placeholder:text-sm outline-none"/>
                        </div>

                        <div className="border-b-[0.03rem] border-black/25 py-4 px-6 w-full">
                            <select className="w-full pb-2 pt-4 pr-6 border-b-[0.03rem] border-white/25 flex justify-start items-center">
                                <option value="" disabled selected className="text-black text-sm">Categories?</option>
                            </select>
                        </div>


                        <div className="border-b-[0.03rem] border-black/25 py-4 px-6 w-full">
                            <select className="w-full pb-2 pt-4 pr-6 border-b-[0.03rem] border-white/25 flex justify-start items-center">
                                <option value="" disabled selected className="text-black text-sm">Activities?</option>
                            </select>
                        </div>

                        <div className="py-8 w-full">
                            <Button variant="outlined" startIcon={<BiSearchAlt/>} style={{color:"black", fontWeight:"400", textTransform:"none", fontSize:"14px", borderColor:"black", borderRadius:"50px", padding:"8px 52px"}}>Search</Button>
                        </div>
                    </div>
                </div>

                <h2 className="font-light text-md text-white">Popular categories: #indonesia #japan #italy #sweden #southkorea</h2>
            </div>
        </div>
    )
}

export default Hero;