import HeroBg from "../assets/images/hero-bg.png";

const Hero = () => {
    return(
        <div className="grow px-6 xl:px-22 3xl:px-42 4xl:px-80 py-2 flex justify-start items-center" style={{backgroundImage: `url(${HeroBg})`}}>
            <div className="flex flex-col justify-between items-start gap-4">
                <h2 className="font-light text-xl text-white">Find out perfect place to hangout in your city</h2>
                <h1 className="font-bold 3xl:text-7xl text-white">Discover great places.</h1>
                <div></div>
                <h2 className="font-light text-md text-white">Popular categories: #indonesia #japan #italy #sweden #southkorea</h2>
            </div>
        </div>
    )
}

export default Hero;