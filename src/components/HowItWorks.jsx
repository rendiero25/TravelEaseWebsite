import { BiCompass } from "react-icons/bi";
import { BiZoomIn } from "react-icons/bi";
import { BiMap } from "react-icons/bi";

import HowItWorksBg from "../assets/images/howitworks-bg2.jpg";

const HowItWorks = () => {
    return (
        <div style={{backgroundImage: `url(${HowItWorksBg})`, backgroundSize:"cover"}} className="py-20 w-full px-6 sm:px-12 xl:px-22 3xl:px-42 4xl:px-80 -mt-25">
            <div className="flex flex-col justify-between items-center xl:items-start gap-10 xl:gap-15">
                <div className="flex flex-col justify-between items-start gap-4">
                    <h2 className="font-medium leading-normal text-4xl text-white">How It Works</h2>
                    <div className="border-1 border-gray w-[2rem]"></div>
                    <p className="text-lg font-light text-white">Explore some of the best tips from around the world.</p>
                </div>

                <div className="flex flex-col xl:flex-row justify-between items-center gap-10">
                    <div className="flex flex-col justify-center items-center gap-4">
                        <div className="flex flex-col justify-between items-center gap-4">
                            <BiCompass className="size-16 text-primary"/>
                            <h3 className="text-2xl font-medium text-white">Explore The City</h3>
                        </div>
                        <p className="text-lg font-light text-white text-center">
                            Discover hidden gems and vibrant cultures as you wander through bustling
                            streets and iconic landmarks.
                        </p>
                    </div>

                    <div className="flex flex-col justify-center items-center gap-4">
                        <div className="flex flex-col justify-between items-center gap-4">
                            <BiZoomIn className="size-16 text-primary"/>
                            <h3 className="text-2xl font-medium text-white">Find Intereseting Place</h3>
                        </div>
                        <p className="text-lg font-light text-white text-center">
                            Uncover extraordinary destinations off the beaten path that will captivate your
                            imagination and create lasting memories.
                        </p>
                    </div>

                    <div className="flex flex-col justify-center items-center gap-4">
                        <div className="flex flex-col justify-between items-center gap-4">
                            <BiMap className="size-16 text-primary"/>
                            <h3 className="text-2xl font-medium text-white">Enjoy Your Destination</h3>
                        </div>
                        <p className="text-lg font-light text-white text-center">
                            Immerse yourself fully in the magic of your chosen locale, savoring every moment
                            of your perfectly crafted travel experience.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HowItWorks;