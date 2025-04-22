import Header from "../components/Header.jsx";
import Hero from "../components/Hero.jsx";
import PromoDisc from "../components/PromoDisc.jsx";

const Index = () => {
    return(
        <div className="p-0 m-0 box-border font-primary">
            <div className="min-h-screen flex">
                <Header/>
                <Hero />
            </div>

            <PromoDisc />
        </div>
    )
}

export default Index;