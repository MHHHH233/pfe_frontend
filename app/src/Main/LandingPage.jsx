import { Carousel } from "../Component/Carousel"
import ContactUsFullscreen from "../Component/Contactus"
import EventsSection from "../Component/Events"
import FeaturesSection from "../Component/Features"
import HeroSection from "../Component/HeroSec"
import TerrainShowcase from "../Component/TerrainShowcase"

export const LandingPage =()=>{
    return(
        <div className="overflow-hidden">
            <HeroSection/>
            <FeaturesSection/>
            <TerrainShowcase/>
            <EventsSection/>
            <Carousel/>
            <ContactUsFullscreen/>
        </div>
    )
}