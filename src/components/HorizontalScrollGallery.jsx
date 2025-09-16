// import { useEffect, useRef, useState } from "react";
// import { WebGLDistortion } from "./WebGLDistortion";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   balcanyVideos,
//   bathroomImages,
//   bedroomImages,
//   interiorVideos,
//   kitchen,
//   outdoorImages,
//   swimmingImages,
// } from "../utils/imges";
// import { i } from "framer-motion/client";
// import Model from "./Model";

// const HorizontalScrollGallery = () => {
//   const containerRef = useRef(null);
//   const galleryRef = useRef(null);
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const webglRefs = useRef([]);
//   const distortionEffects = useRef([]);
//   const [category, setCategory] = useState(null);
//   const [currentIndex, setCurrentIndex] = useState(0);

//   // Mock data (replace with your actual imports)
//   const images = {
//     outdoorImages,
//     bedroomImages,
//     balcanyVideos,
//     swimmingImages,
//     interiorVideos,
//     kitchen,
//     bathroomImages,
//   };

//   const categoryLabels = {
//     outdoorImages: "Outdoor",
//     bedroomImages: "Bedrooms",
//     balcanyVideos: "Balcony",
//     swimmingImages: "Swimming Pool",
//     interiorVideos: "Interior",
//     kitchen: "Kitchen",
//     bathroomImages: "Bathrooms",
//   };

//   const data = Object.entries(images).map(([key, value]) => {
//     const [header, ...mediaItems] = value; // first object is the section header
//     return {
//       categoryName: categoryLabels[key] || key,
//       sectionTitle: header.sectionTitle,
//       sectionDescription: header.sectionDescription,
//       items: mediaItems,
//     };
//   });

//   // GSAP Horizontal Scroll
//   useEffect(() => {
//     const loadGSAP = () => {
//       return new Promise((resolve) => {
//         if (window.gsap && window.ScrollTrigger) {
//           resolve();
//           return;
//         }

//         const script1 = document.createElement("script");
//         script1.src =
//           "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js";
//         document.head.appendChild(script1);

//         const script2 = document.createElement("script");
//         script2.src =
//           "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js";
//         document.head.appendChild(script2);

//         script2.onload = () => {
//           resolve();
//         };
//       });
//     };

//     loadGSAP().then(() => {
//       if (window.gsap && galleryRef.current && containerRef.current) {
//         window.gsap.registerPlugin(window.ScrollTrigger);

//         const gallery = galleryRef.current;
//         const container = containerRef.current;

//         if (!gallery || !container) return;

//         const totalWidth = gallery.scrollWidth - window.innerWidth;

//         const scrollTween = window.gsap.to(gallery, {
//           x: -totalWidth,
//           ease: "none",
//           duration: 1,
//         });

//         window.ScrollTrigger.create({
//           trigger: container,
//           start: "top top",
//           end: () => `+=${totalWidth}`,
//           pin: true,
//           scrub: 1,
//           animation: scrollTween,
//           snap: {
//             snapTo: (progress) => {
//               const snapProgress =
//                 Math.round(progress * (data.length - 1)) / (data.length - 1);
//               return snapProgress;
//             },
//             duration: 0.3,
//             delay: 0.1,
//           },
//           onUpdate: (self) => {
//             const index = Math.round(self.progress * (data.length - 1));
//             setCurrentIndex(index);
//           },
//         });

//         return () => {
//           if (window.ScrollTrigger) {
//             window.ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
//           }
//         };
//       }
//     });
//   }, [data.length]);

//   // WebGL Setup
//   const setupWebGLEffect = (canvas, imageSrc, index) => {
//     if (!canvas) return;
//     try {
//       const distortion = new WebGLDistortion(canvas, imageSrc);
//       distortionEffects.current[index] = distortion;

//       const handleMouseMove = (e) => {
//         const rect = canvas.getBoundingClientRect();
//         const x = e.clientX - rect.left;
//         const y = e.clientY - rect.top;
//         distortion.updateMouse(x, y);
//       };

//       const handleMouseEnter = (e) => {
//         const rect = canvas.getBoundingClientRect();
//         const x = e.clientX - rect.left;
//         const y = e.clientY - rect.top;
//         distortion.updateMouse(x, y);
//       };

//       const handleMouseLeave = () => {
//         distortion.updateMouse(-100, -100);
//       };

//       canvas.addEventListener("mouseenter", handleMouseEnter);
//       canvas.addEventListener("mousemove", handleMouseMove);
//       canvas.addEventListener("mouseleave", handleMouseLeave);

//       canvas._cleanup = () => {
//         distortion.destroy();
//         canvas.removeEventListener("mouseenter", handleMouseEnter);
//         canvas.removeEventListener("mousemove", handleMouseMove);
//         canvas.removeEventListener("mouseleave", handleMouseLeave);
//       };
//     } catch (error) {
//       console.warn("WebGL setup failed:", error);
//     }
//   };

//   useEffect(() => {
//     webglRefs.current.forEach((canvas, index) => {
//       const firstItem = data[index]?.items[0];
//       if (canvas && firstItem && firstItem.type === "image") {
//         setupWebGLEffect(canvas, firstItem.src, index);
//       }
//     });

//     return () => {
//       webglRefs.current.forEach((canvas) => {
//         if (canvas && canvas._cleanup) canvas._cleanup();
//       });
//       distortionEffects.current.forEach((effect) => {
//         if (effect && effect.destroy) effect.destroy();
//       });
//     };
//   }, [data]);

//   // Modal handlers
//   const openModal = (imageSrc) => {
//     setSelectedImage(imageSrc);
//     setIsModalOpen(true);
//     document.body.style.overflow = "hidden";
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setSelectedImage(null);
//     setCategory(null);
//     document.body.style.overflow = "auto";
//   };

//   const handleModalBackgroundClick = (e) => {
//     if (e.target === e.currentTarget) closeModal();
//   };

//   // Scroll Navigation - Fixed for proper indexing
//   const scrollToIndex = (index) => {
//     if (
//       !galleryRef.current ||
//       !window.gsap ||
//       index < 0 ||
//       index >= data.length
//     )
//       return;

//     // Calculate the exact position for each slide
//     const slideWidth = window.innerWidth;
//     const targetX = -index * slideWidth;

//     window.gsap.to(galleryRef.current, {
//       x: targetX,
//       duration: 0.8,
//       ease: "power2.inOut",
//       onComplete: () => {
//         setCurrentIndex(index);
//         // Force ScrollTrigger to update
//         // if (window.ScrollTrigger) {
//         //   window.ScrollTrigger.refresh();
//         // }
//       },
//     });
//   };

//   const scrollPrev = () => {
//     if (currentIndex > 0) scrollToIndex(currentIndex - 1);
//   };

//   const scrollNext = () => {
//     if (currentIndex < data.length - 1) scrollToIndex(currentIndex + 1);
//   };

//   // Keyboard navigation
//   useEffect(() => {
//     const handleKey = (e) => {
//       if (e.key === "ArrowRight") scrollNext();
//       if (e.key === "ArrowLeft") scrollPrev();
//       if (e.key === "Escape") closeModal();
//     };
//     window.addEventListener("keydown", handleKey);
//     return () => window.removeEventListener("keydown", handleKey);
//   }, [currentIndex, data.length]);

//   return (
//     <div className="relative w-screen ">
//       {/* Horizontal Scroll Gallery */}
//       <div
//         ref={containerRef}
//         className="relative min-h-screen w-screen overflow-hidden bg-black"
//       >
//         <div ref={galleryRef} className="flex h-screen bg-black">
//           {data.map(
//             (
//               { categoryName, sectionTitle, sectionDescription, items },
//               index
//             ) => {
//               const firstItem = items[0]; // first media (after header)
//               return (
//                 <div
//                   key={index}
//                   className="flex-shrink-0 w-full h-screen relative flex flex-col items-center justify-center p-4 bg-black"
//                 >
//                   {/* Section Header */}
//                   <div className="absolute top-1/2 left-20 z-20 text-center mb-6">
//                     <h2 className="text-6xl font-bold text-white DM">
//                       {sectionTitle}
//                     </h2>
//                   </div>

//                   <div className="absolute top-1/2 right-20 w-100 z-20 text-center mb-6">
//                     <p className="text-2xl text-gray-300 DM">
//                       {sectionDescription}
//                     </p>
//                   </div>

//                   {/* Background */}
//                   <div className="w-[100%] absolute inset-0 opacity-30">
//                     {firstItem.type === "video" ? (
//                       <video
//                         src={firstItem.src}
//                         className="w-full h-full object-cover"
//                         autoPlay
//                         loop
//                         muted
//                         playsInline
//                         poster="/fallback.jpg"
//                       />
//                     ) : (
//                       <img
//                         src={firstItem.src}
//                         alt={`${categoryName} background`}
//                         className="w-full h-full object-cover"
//                         loading="lazy"
//                       />
//                     )}
//                     <div className="absolute inset-0 bg-black/30" />
//                   </div>

//                   {/* Main Preview */}
//                   <div className="relative z-10 w-full max-w-6xl mx-auto">
//                     <div className="relative w-full h-[70vh] max-h-[800px] overflow-hidden shadow-2xl">
//                       {firstItem.type === "video" ? (
//                         <video
//                           src={firstItem.src}
//                           className="absolute top-0 left-0 w-full h-full object-cover cursor-pointer"
//                           autoPlay
//                           loop
//                           muted
//                           playsInline
//                           poster="/fallback.jpg"
//                           onClick={() => {
//                             setCategory(items);
//                             setIsModalOpen(true);
//                           }}
//                         />
//                       ) : (
//                         <>
//                           <canvas
//                             ref={(el) => (webglRefs.current[index] = el)}
//                             className="absolute inset-0 w-full h-full cursor-pointer transform scale-x-[-1] scale-y-[-1]"
//                             onClick={() => {
//                               setCategory(items);
//                               setIsModalOpen(true);
//                             }}
//                           />
//                           <img
//                             src={firstItem.src}
//                             alt={`${categoryName} preview`}
//                             className="w-full h-full object-cover opacity-0 pointer-events-none"
//                             loading="lazy"
//                           />
//                         </>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               );
//             }
//           )}
//         </div>

//         {/* Scroll Controls */}
//         <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center space-y-4">
//           {/* Prev / Next Buttons */}
//           <div className="flex items-center bg-white/10 backdrop-blur-md rounded-full px-6 py-3 border border-white/20 shadow-lg space-x-6">
//             <button
//               onClick={scrollPrev}
//               disabled={currentIndex === 0}
//               className="w-12 h-12 flex items-center justify-center rounded-full bg-black/40 hover:bg-white/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="w-6 h-6 text-white"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M15 19l-7-7 7-7"
//                 />
//               </svg>
//             </button>
//             <button
//               onClick={scrollNext}
//               disabled={currentIndex === data.length - 1}
//               className="w-12 h-12 flex items-center justify-center rounded-full bg-black/40 hover:bg-white/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="w-6 h-6 text-white"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M9 5l7 7-7 7"
//                 />
//               </svg>
//             </button>
//           </div>

//           {/* Number Counter */}
//           <div className="flex items-baseline space-x-2 text-white font-light tracking-widest text-5xl">
//             <span className="relative h-14 overflow-hidden w-14 flex justify-center">
//               <AnimatePresence mode="wait">
//                 <motion.span
//                   key={currentIndex}
//                   initial={{ y: "100%", opacity: 0 }}
//                   animate={{ y: "0%", opacity: 1 }}
//                   exit={{ y: "-100%", opacity: 0 }}
//                   transition={{ duration: 0.5, ease: "easeInOut" }}
//                   className="absolute"
//                 >
//                   {String(currentIndex + 1).padStart(2, "0")}
//                 </motion.span>
//               </AnimatePresence>
//             </span>
//             <span className="text-3xl opacity-70">
//               /{String(data.length).padStart(2, "0")}
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* Post-scroll Content */}
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
//         <div className="text-center text-white px-8 max-w-4xl">
//           <h2 className="text-4xl md:text-6xl font-bold mb-6">
//             Find Your Dream Home
//           </h2>
//           <p className="text-xl text-gray-300 mb-8">
//             Ready to make one of these properties yours? Contact us today to
//             schedule a viewing.
//           </p>
//           <button className="bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300">
//             Contact Us
//           </button>
//         </div>
//       </div>

//       {/* Modal */}
//       {isModalOpen && category && (
//         <Model
//           category={category}
//           setIsModalOpen={setIsModalOpen}
//           handleModalBackgroundClick={handleModalBackgroundClick}
//         />
//       )}
//     </div>
//   );
// };

// export default HorizontalScrollGallery;

import { useEffect, useRef, useState } from "react";
import { WebGLDistortion } from "./WebGLDistortion";
import { motion, AnimatePresence } from "framer-motion";

import Model from "./Model";
import { outdoorContent } from "../utils/outdoorContent";
import { bedroomContent } from "../utils/bedroomContent";
import { balcanyContent } from "../utils/balcanyContent";
import { swimmingContent } from "../utils/swimmingContent";
import { interiorContent } from "../utils/interiorContent";
import { kitchenContent } from "../utils/kitchenContent";
import { bathroomContent } from "../utils/bathroomContent";

const HorizontalScrollGallery = () => {
  const containerRef = useRef(null);
  const galleryRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [category, setCategory] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const webglRefs = useRef([]);
  const distortionEffects = useRef([]);

  // Data setup
  const images = {
    outdoorContent,
    bedroomContent,
    balcanyContent,
    swimmingContent,
    interiorContent,
    kitchenContent,
    bathroomContent,
  };

  const categoryLabels = {
    outdoorImages: "Outdoor",
    bedroomImages: "Bedrooms",
    balcanyVideos: "Balcony",
    swimmingImages: "Swimming Pool",
    interiorVideos: "Interior",
    kitchen: "Kitchen",
    bathroomImages: "Bathrooms",
  };

  console.log("images", images);

  const data = Object.entries(images).map(([key, value]) => {
    const [header, ...mediaItems] = value;
    return {
      categoryName: categoryLabels[key] || key,
      sectionTitle: header.sectionTitle,
      sectionDescription: header.sectionDescription,
      items: mediaItems,
    };
  });

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // GSAP Horizontal Scroll (desktop only)
  useEffect(() => {
    if (isMobile) return;

    const loadGSAP = () =>
      new Promise((resolve) => {
        if (window.gsap && window.ScrollTrigger) {
          resolve();
          return;
        }
        const script1 = document.createElement("script");
        script1.src =
          "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js";
        document.head.appendChild(script1);

        const script2 = document.createElement("script");
        script2.src =
          "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js";
        document.head.appendChild(script2);

        script2.onload = () => resolve();
      });

    loadGSAP().then(() => {
      if (window.gsap && galleryRef.current && containerRef.current) {
        window.gsap.registerPlugin(window.ScrollTrigger);
        const gallery = galleryRef.current;
        const container = containerRef.current;
        const totalWidth = gallery.scrollWidth - window.innerWidth;

        const scrollTween = window.gsap.to(gallery, {
          x: -totalWidth,
          ease: "none",
          duration: 1,
        });

        window.ScrollTrigger.create({
          trigger: container,
          start: "top top",
          end: () => `+=${totalWidth}`,
          pin: true,
          scrub: 1,
          animation: scrollTween,
          snap: {
            snapTo: (progress) =>
              Math.round(progress * (data.length - 1)) / (data.length - 1),
            duration: 0.3,
            delay: 0.1,
          },
          onUpdate: (self) => {
            const index = Math.round(self.progress * (data.length - 1));
            setCurrentIndex(index);
          },
        });

        return () => {
          if (window.ScrollTrigger) {
            window.ScrollTrigger.getAll().forEach((t) => t.kill());
          }
        };
      }
    });
  }, [isMobile, data.length]);

  // WebGL setup
  const setupWebGLEffect = (canvas, imageSrc, index) => {
    if (!canvas) return;
    try {
      const distortion = new WebGLDistortion(canvas, imageSrc);
      distortionEffects.current[index] = distortion;

      const handleMouseMove = (e) => {
        const rect = canvas.getBoundingClientRect();
        distortion.updateMouse(e.clientX - rect.left, e.clientY - rect.top);
      };

      canvas.addEventListener("mousemove", handleMouseMove);
      canvas.addEventListener("mouseenter", handleMouseMove);
      canvas.addEventListener("mouseleave", () =>
        distortion.updateMouse(-100, -100)
      );

      canvas._cleanup = () => {
        distortion.destroy();
        canvas.removeEventListener("mousemove", handleMouseMove);
      };
    } catch (err) {
      console.warn("WebGL setup failed:", err);
    }
  };

  useEffect(() => {
    if (isMobile) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.dataset.index);
            const firstItem = data[index]?.items[0];
            if (entry.target && firstItem?.type === "image") {
              setupWebGLEffect(entry.target, firstItem.src, index);
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    webglRefs.current.forEach((canvas) => canvas && observer.observe(canvas));
    return () => observer.disconnect();
  }, [isMobile, data]);

  // Modal handlers
  const closeModal = () => {
    setIsModalOpen(false);
    setCategory(null);
    document.body.style.overflow = "auto";
  };

  // Scroll nav (desktop)
  const scrollToIndex = (index) => {
    if (!galleryRef.current || !window.gsap) return;
    const targetX = -index * window.innerWidth;
    window.gsap.to(galleryRef.current, {
      x: targetX,
      duration: 0.8,
      ease: "power2.inOut",
      onComplete: () => setCurrentIndex(index),
    });
  };

  const scrollPrev = () => setCurrentIndex((prev) => Math.max(prev - 1, 0));
  const scrollNext = () =>
    setCurrentIndex((prev) => Math.min(prev + 1, data.length - 1));

  // Keyboard nav
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowRight") scrollNext();
      if (e.key === "ArrowLeft") scrollPrev();
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [currentIndex]);

  return (
    <div className="relative w-screen">
      {/* Desktop View */}
      {!isMobile && (
        <div
          ref={containerRef}
          className="relative min-h-screen w-screen overflow-hidden bg-black"
        >
          <div ref={galleryRef} className="flex h-screen bg-black">
            {data.map(
              (
                { categoryName, sectionTitle, sectionDescription, items },
                index
              ) => {
                const firstItem = items[0];
                return (
                  <div
                    key={index}
                    className="flex-shrink-0 w-full h-screen relative flex items-center justify-center p-4 bg-black"
                  >
                    <div className=" z-20 text-center mb-6">
                      <h2 className="text-6xl font-bold text-white">
                        {sectionTitle}
                      </h2>
                    </div>

                    <div className="w-[100%] absolute inset-0 opacity-30">
                      {firstItem.type === "video" ? (
                        <video
                          src={firstItem.src}
                          className="w-full h-full object-cover"
                          preload="none" // ⬅️ Don’t preload video
                          playsInline
                          muted
                          loop
                          autoPlay={true} // ⬅️ Don’t autoplay background videos
                          controls={false}
                        />
                      ) : (
                        <img
                          src={firstItem.src}
                          alt={`${categoryName} background`}
                          loading="lazy" // ⬅️ Load only when visible
                          className="w-full h-full object-cover"
                        />
                      )}
                      <div className="absolute inset-0 bg-black/30" />
                    </div>
                    <div className="relative z-10 w-full max-w-6xl mx-auto">
                      <div className="relative w-full h-[70vh] max-h-[800px] overflow-hidden shadow-2xl rounded-[50px]">
                        {firstItem.type === "video" ? (
                          <div>
                            <video
                              src={firstItem.src}
                              className="absolute top-0 left-0 w-full h-full object-cover cursor-pointer"
                              autoPlay
                              loop
                              muted
                              onClick={() => {
                                setCategory(items);
                                setIsModalOpen(true);
                              }}
                            />
                            {/* Overlay */}
                            <div
                              className="absolute inset-0 bg-black/30 flex items-center justify-center cursor-pointer"
                              onClick={() => {
                                setCategory(items);
                                setIsModalOpen(true);
                              }}
                            >
                              <div className="animate-bounce flex">
                                <div className="flex flex-col text-center text-amber-400">
                                  <p className="text-amber-400 mb-2 font-bold text-xl">
                                    To Explore More
                                  </p>
                                  <p className="text-amber-400 mb-2 font-bold text-xl">
                                    Click Here
                                  </p>
                                </div>
                                <svg
                                  className="w-15 h-18 mx-auto text-amber-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                                  />
                                </svg>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <>
                            <canvas
                              ref={(el) => (webglRefs.current[index] = el)}
                              className="absolute inset-0 w-full h-full cursor-pointer"
                              onClick={() => {
                                setCategory(items);
                                setIsModalOpen(true);
                              }}
                            />
                            <img
                              src={firstItem.src}
                              alt={`${categoryName} preview`}
                              loading="lazy" // ⬅️ Load only when visible
                              className="w-full h-full object-cover opacity-0"
                            />
                          </>
                        )}
                      </div>
                    </div>
                    <div className=" w-100 z-20 text-center mb-6 p-5">
                      <p className="text-2xl text-gray-300">
                        {sectionDescription}
                      </p>
                    </div>
                  </div>
                );
              }
            )}
          </div>

          {/* Desktop Controls */}
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center space-y-4">
            <div className="flex items-center bg-white/10 backdrop-blur-md rounded-full px-6 py-3 border border-white/20 shadow-lg space-x-6">
              <button
                onClick={() => scrollToIndex(currentIndex - 1)}
                disabled={currentIndex === 0}
                className="w-12 h-12 flex items-center justify-center rounded-full bg-black/40 hover:bg-white/20 transition disabled:opacity-50"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                onClick={() => scrollToIndex(currentIndex + 1)}
                disabled={currentIndex === data.length - 1}
                className="w-12 h-12 flex items-center justify-center rounded-full bg-black/40 hover:bg-white/20 transition disabled:opacity-50"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
            <div className="flex items-baseline space-x-2 text-white font-light tracking-widest text-5xl">
              <span className="relative h-14 overflow-hidden w-14 flex justify-center">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={currentIndex}
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: "0%", opacity: 1 }}
                    exit={{ y: "-100%", opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute"
                  >
                    {String(currentIndex + 1).padStart(2, "0")}
                  </motion.span>
                </AnimatePresence>
              </span>
              <span className="text-3xl opacity-70">
                /{String(data.length).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Mobile View */}
      {isMobile && (
        <div className="relative min-h-screen w-screen overflow-hidden bg-black">
          {data.length > 0 && (
            <div className="flex flex-col items-center justify-center h-screen relative">
              {(() => {
                const { sectionTitle, sectionDescription, items } =
                  data[currentIndex];
                const firstItem = items[0];
                return (
                  <>
                    <div className="absolute top-10 text-center px-4">
                      <h2 className="text-4xl font-bold text-white">
                        {sectionTitle}
                      </h2>
                      <p className="text-lg text-gray-300 mt-2">
                        {sectionDescription}
                      </p>
                    </div>
                    <div className="w-full h-full absolute inset-0 opacity-30">
                      {firstItem.type === "video" ? (
                        <video
                          src={firstItem.src}
                          className="w-full h-full object-cover"
                          autoPlay
                          loop
                          muted
                        />
                      ) : (
                        <img
                          src={firstItem.src}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      )}
                      <div className="absolute inset-0 bg-black/30" />
                    </div>
                    <div className="relative z-10 w-full max-w-lg mx-auto">
                      <div className="relative w-full h-[60vh] overflow-hidden shadow-xl ">
                        {firstItem.type === "video" ? (
                          <video
                            src={firstItem.src}
                            className="w-full h-full object-cover cursor-pointer"
                            autoPlay
                            loop
                            muted
                            onClick={() => {
                              setCategory(items);
                              setIsModalOpen(true);
                            }}
                          />
                        ) : (
                          <img
                            src={firstItem.src}
                            className="w-full h-full object-cover cursor-pointer"
                            onClick={() => {
                              setCategory(items);
                              setIsModalOpen(true);
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          )}

          {/* Mobile Controls */}
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center space-y-4">
            <div className="flex items-center bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/20 shadow-lg space-x-4">
              <button
                onClick={() => scrollPrev()}
                disabled={currentIndex === 0}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-black/40 hover:bg-white/20 transition disabled:opacity-50"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                onClick={() => scrollNext()}
                disabled={currentIndex === data.length - 1}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-black/40 hover:bg-white/20 transition disabled:opacity-50"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
            <div className="flex items-baseline space-x-2 text-white font-light tracking-widest text-3xl">
              <span className="relative h-10 overflow-hidden w-10 flex justify-center">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={currentIndex}
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: "0%", opacity: 1 }}
                    exit={{ y: "-100%", opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute"
                  >
                    {String(currentIndex + 1).padStart(2, "0")}
                  </motion.span>
                </AnimatePresence>
              </span>
              <span className="text-xl opacity-70">
                /{String(data.length).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && category && (
        <Model
          category={category}
          setIsModalOpen={setIsModalOpen}
          handleModalBackgroundClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        />
      )}
    </div>
  );
};

export default HorizontalScrollGallery;
