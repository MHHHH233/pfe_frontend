import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import { Icon } from "@iconify/react";
import "swiper/css";
import "swiper/css/pagination";

export const Carousel = () => {
    const swiperRef = useRef(null);
    const [activeSlide, setActiveSlide] = useState(0); 
    const testimonials = [
        { id: 1, text: "Terrains au top, ambiance excellente, je recommande !", author: "Mahdi Jmayki" },
        { id: 2, text: "L'académie est géniale, mes enfants adorent les entraînements !", author: "Sophie Rain" },
        { id: 3, text: "Une organisation parfaite, on a passé un excellent moment !", author: "Anonymous" },
        { id: 4, text: "Des entraîneurs professionnels, j'ai amélioré mes compétences en un rien de temps !", author: "John Doe" },
        { id: 5, text: "Une expérience incroyable, j'y retournerai sans hésiter !", author: "Alice Dupont" },
        { id: 6, text: "Ambiance chaleureuse et dynamique, un lieu parfait pour se ressourcer.", author: "Paul Martin" },
        { id: 7, text: "Je recommande vivement cette académie, mes enfants sont ravis !", author: "Marie Claire" },
        { id: 8, text: "Un service de qualité, je me suis vraiment bien amusé ici.", author: "Vincent Leblanc" },
    ];

    const CustomNavigation = (direction) => {
        if (swiperRef.current) {
            if (direction === "next") {
                swiperRef.current.swiper.slideNext();
            } else if (direction === "prev") {
                swiperRef.current.swiper.slidePrev();
            }
        }
    };

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-center text-[2.5rem] font-bold mb-10 text-lime-50">Témoignages</h1>
            <div className="flex items-center justify-center">
                
                <button
                    className="hidden 2xl:flex items-center justify-center   text-white p-3   transition"
                    onClick={() => CustomNavigation("prev")}
                >
                  <Icon icon="material-symbols:arrow-left-alt-rounded" className="hover:text-gray-400 " width="4em" height="4em" />
                </button>

                <div className="w-full lg:w-[70rem] mx-5 p-6 lg:p-0 ">
                    <Swiper
                    className=""
                        ref={swiperRef}
                        modules={[Pagination, Navigation, Autoplay]}
                        loop={true} 
                        autoplay={{ delay: 3000, disableOnInteraction: false }}
                        pagination={{ clickable: true ,el:'.pagination'}}
                        slidesPerView={1}
                        centeredSlides={true}
                        
                        speed={700} 
                        breakpoints={{
                            0: { slidesPerView: 1 },
                            600: { slidesPerView: 2 },
                            1536: { slidesPerView: 3  },
                        }}
                        onSlideChange={(swiper) => {
                            setActiveSlide(swiper.realIndex); 
                        }}
                    >
                        {testimonials.map((item, index) => (
                           <SwiperSlide key={item.id} className="flex items-center p-5 lg:text-white ">
                           <div
                               className={`p-6  rounded-2xl shadow-md min-h-[300px] md:min-h-[400px] lg:min-h-[320px] flex flex-col justify-between transition-all
                               ${index === activeSlide ? ' lg:bg-medium-gray bg-lime-300  scale-110' : 'lg:bg-dark-gray bg-white lg:opacity-45'}
                               ${index === activeSlide ? 'transform' : ''}`}
                           >
                               <p className="text-center  lg:mt-21 mt-20 text-lg">"{item.text}"</p>
                               <div className="flex justify-start items-center font-semibold ">
                                   <div className="h-11 w-11 bg-green-500 rounded-full mr-4"></div>- {item.author}
                               </div>
                           </div>
                       </SwiperSlide>
                       
                        ))}
                        <div className="hidden lg:block pagination text-center space-x-5"></div>
                    </Swiper>
                </div>

                
                <button
                    className="hidden 2xl:flex items-center justify-center text-white p-3 rounded-full transition"
                    onClick={() => CustomNavigation("next")}
                >
                    <Icon icon="material-symbols:arrow-right-alt-rounded" className="hover:text-gray-400 " width="4em" height="4em" />
                </button>
                
                    
                
                
            </div>
            <style jsx>{`
              .pagination {

                margin-top: 30px;    
              }

              .swiper-pagination-bullet {
                background-color: #07f46a6e;
                width: 1.3rem;
                height: 1.3rem;
              }

              .swiper-pagination-bullet-active {
                background-color: #07F468;
              }
            `}</style>
        </div>
    );
};
