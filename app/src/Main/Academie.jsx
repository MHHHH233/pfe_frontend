import { motion } from "framer-motion"
import { Header } from "../Component/Academie/Header"
import { Navigation } from "../Component/Academie/Navigation"
import { AcademyInfo } from "../Component/Academie/Academie-info"
import { CoachesSection } from "../Component/Academie/Coach-section"
import Tarifs from "../Component/Academie/Tarifs-sec"
import ProgrammeEntrainement from "../Component/Academie/Programme"
import LocationComponent from "../Component/Academie/Location"
import EventsSection from "../Component/Events"
import useScrollToSection from "../lib/hooks/useScrollToSection"

const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
}

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 }
  }
}

export default function AcademyPage() {
  // Use the custom hook to handle scrolling to sections based on URL hash
  useScrollToSection();
  
  return (
    <div className="min-h-screen min-w-screen bg-cover bg-center bg-[#1a1a1a] text-white">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={pageVariants}
        className="max-w-6xl mx-auto px-4 py-12 "
      >
        <Header />
        {/* <Navigation /> */}
        <AcademyInfo />
        <EventsSection/>
        <CoachesSection />
      </motion.div>
      <Tarifs/>
      <ProgrammeEntrainement/>   
      <LocationComponent/>    
    </div>
  )
}
