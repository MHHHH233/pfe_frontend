import { Carousel } from "../Component/Carousel"
import ContactUsFullscreen from "../Component/Contactus"
import EventsSection from "../Component/Events"
import FeaturesSection from "../Component/Features"
import HeroSection from "../Component/HeroSec"

export const LandingPage =()=>{
    return(
        <>
            <HeroSection/>
            <FeaturesSection/>
            <EventsSection/>
            <Carousel/>
            <ContactUsFullscreen/>
        </>
    )
}