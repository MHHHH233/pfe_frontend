import { Link } from "react-router-dom";
import LogoGreen from '../img/logoGreen.PNG'
import Separateur from '../img/separateur.png'
export const Footer = () => {
    return (
        <footer className=" text-white py-10">
            <div className="flex justify-center w-full">
            <img src={Separateur} alt="Seaparateur" className="w-full" />    
            </div>
            
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                {/* Left Column */}
                <div>
                    <h2 className="text-green-500 font-bold text-lg mb-4">Terrana FC</h2>
                    {/* <img src={LogoGreen} alt="" className="w-32 text-start bg-white opacity-90" /> */}
                    <p>
                        Votre destination pour des terrains de football 5v5 et 6v6, des tournois
                        palpitants, et une académie pour les passionnés de football.
                    </p>
                </div>

                {/* Middle Column */}
                <div>
                    <h2 className="text-green-500 font-bold text-lg mb-4">Liens rapides</h2>
                    <ul className="space-y-2">
                        <li><Link to="/" className="hover:underline">Accueil</Link></li>
                        <li><Link to="/Linkbout" className="hover:underline">À propos</Link></li>
                        <li><Link to="/contact" className="hover:underline">Contact</Link></li>
                        <li><Link to="/tournaments" className="hover:underline">Tournois</Link></li>
                    </ul>
                </div>

                {/* Right Column */}
                <div>
                    <h2 className="text-green-500 font-bold text-lg mb-4">Contactez-nous</h2>
                    <ul className="space-y-2">
                        <li>📍 Rue des Sports, 123, Marrakech, Maroc</li>
                        <li>📞 +212 6 12 34 56 78</li>
                        <li>📧 contact@terranafc.com</li>
                    </ul>
                </div>
            </div>

            <hr className="my-8 border-gray-700" />

            
            <div className="container mx-auto text-center">
                <p>© 2024 Terrana FC. Tous droits réservés.</p>
                <p className="mt-2">
                    Suivez-nous sur{' '}
                    <a href="https://facebook.com" target="_blank" className="text-green-500 hover:underline">Facebook</a>,{' '}
                    <a href="https://instagram.com" target="_blank" className="text-green-500 hover:underline">Instagram</a>,{' '}
                    <a href="https://twitter.com"target="_blank" className="text-green-500 hover:underline">Twitter</a>
                </p>
            </div>
        </footer>
    );
};


