import React from "react";
import home1 from "../assets/home1.png";
import home2 from "../assets/home2.png";
import kids from "../assets/kids.png";
import retro from "../assets/retro.png";
import InfoSection from "../components/InfoSection.jsx";
import CategorySection from "../components/CategorySection.jsx";

const Home = () => {
    return (
        <div className="w-full pt-45"> 
            {/* Hero Section 1 */}
            <section className="w-full">
                <img
                    src={home1}
                    alt="Hero Banner 1"
                    className="w-full object-cover"
                />
            </section>

            {/* Hero Section 2 */}
            <section className="w-full">
                <img
                    src={home2}
                    alt="Hero Banner 2"
                    className="w-full object-cover"
                />
            </section>

            {/* Kids Jersey Banner */}
            <section className="w-full">
                <img
                    src={kids}
                    alt="Kids Jerseys"
                    className="w-full object-cover"
                />
            </section>

            {/* Retro Jersey Banner */}
            <section className="w-full">
                <img
                    src={retro}
                    alt="Retro Jerseys"
                    className="w-full object-cover"
                />
            </section>
            <InfoSection />
            <CategorySection />
        </div>
        
    );
};

export default Home;