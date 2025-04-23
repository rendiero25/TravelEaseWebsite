import Header from "../components/Header.jsx";
import Hero from "../components/Hero.jsx";
import PromoDisc from "../components/PromoDisc.jsx";
import Banner from "../components/Banner.jsx";
import TopActivities from "../components/TopActivities.jsx";
import TopCategories from "../components/TopCategories.jsx";

const Index = () => {
    return(
        <div className="p-0 m-0 box-border font-primary">
            <div className="min-h-screen flex">
                <Header/>
                <Hero />
            </div>

            <div className="flex flex-col gap-50 4xl:gap-56">
                <PromoDisc />
                <Banner />
                <div className="flex flex-col gap-25 -mt-32 sm:-mt-42 xl:-mt-28 4xl:-mt-46 5xl:-mt-48">
                    <TopCategories />
                    <TopActivities />
                </div>
            </div>
        </div>
    )
}

export default Index;