import Header from "../components/Header.jsx";
import Hero from "../components/Hero.jsx";
import TopRatedExp from "../components/TopRatedExp.jsx";

const Index = () => {
    return(
        <div className="p-0 m-0 box-border font-primary">
            <div className="min-h-screen flex">
                <Header/>
                <Hero />
            </div>

            <TopRatedExp />
        </div>
    )
}

export default Index;