import HeroBg from "../assets/images/hero-bg.jpg";

const Hero = () => {
    return(
        <div>
            <img src={HeroBg} alt="" className="w-full min-h-screen object-cover"/>
        </div>
    )
}

export default Hero;