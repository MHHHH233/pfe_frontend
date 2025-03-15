import React from 'react'
import { Mail, Phone, ArrowRight } from 'lucide-react'

const ContactUsFullscreen = () => {
  return (
    <div className="bg-[#1a1a1a] text-white min-h-screen flex flex-col justify-center items-center p-6">
      <div className="max-w-5xl w-full">
        <h2 className="text-5xl font-bold mb-6 text-center">Contactez-nous</h2>
        <p className="text-xl text-center mb-12 text-gray-300">
          Besoin d&apos;aide ou d&apos;informations ? Nous sommes là pour vous !
        </p>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div className="bg-[#333] p-8 rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 transform">
            <h3 className="text-2xl font-semibold mb-6 flex items-center text-green-400">
              <Mail className="mr-4" size={32} />
              E-mail
            </h3>
            <a
              href="mailto:contact@terranafe.com"
              className="text-xl hover:text-green-300 transition-colors duration-300 flex items-center group"
            >
              contact@terranafe.com
              <ArrowRight className="ml-2 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-2 transition-all duration-300" size={20} />
            </a>
          </div>
          <div className="bg-[#333] p-8 rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 transform">
            <h3 className="text-2xl font-semibold mb-6 flex items-center text-green-400">
              <Phone className="mr-4" size={32} />
              Téléphone
            </h3>
            <a
              href="tel:+21261234567"
              className="text-xl hover:text-green-300 transition-colors duration-300 flex items-center group"
            >
              +212 6 12 34 56 78
              <ArrowRight className="ml-2 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-2 transition-all duration-300" size={20} />
            </a>
          </div>
        </div>

        <div className="text-center">
          <button
            href="/contact"
            className="inline-flex items-center bg-green-500 text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 hover:bg-green-600 hover:shadow-xl transform hover:-translate-y-1 text-lg"
          >
            Aller à la page Contact
            <ArrowRight className="ml-3" size={24} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ContactUsFullscreen

