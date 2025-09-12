// import React, { useState } from "react";

// const Model = ({ category, setIsModalOpen, handleModalBackgroundClick }) => {
//   const [currentIndex, setCurrentIndex] = useState(0);

//   if (!category || !Array.isArray(category)) {
//     return null;
//   }

//   const nextImage = () => {
//     setCurrentIndex((prev) => (prev + 1) % category.length);
//   };

//   const prevImage = () => {
//     setCurrentIndex((prev) => (prev - 1 + category.length) % category.length);
//   };

//   const currentItem = category[currentIndex];

//   return (
//     <div
//       className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 transition-all duration-500"
//       onClick={handleModalBackgroundClick}
//     >
//       <div className="relative max-w-7xl max-h-full transition-all duration-500">
//         {/* Close Button */}
//         <button
//           onClick={() => setIsModalOpen(false)}
//           className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors duration-200 z-10"
//         >
//           <svg
//             className="w-8 h-8"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M6 18L18 6M6 6l12 12"
//             />
//           </svg>
//         </button>

//         {/* Main Content */}
//         <div className="relative">
//           <div className="flex items-center justify-center w-full h-full">
//             {currentItem?.type === "video" ? (
//               <video
//                 key={currentIndex}
//                 src={currentItem.src}
//                 className="max-h-[800px] object-contain rounded-xl shadow-md"
//                 autoPlay
//                 loop
//                 muted
//                 playsInline
//                 controls
//               />
//             ) : (
//               <img
//                 key={currentIndex}
//                 src={currentItem?.src || currentItem}
//                 alt={`Gallery item ${currentIndex + 1}`}
//                 className="max-h-[800px] object-contain rounded-xl shadow-md transition-transform duration-300 hover:scale-105"
//               />
//             )}
//           </div>

//           {/* Navigation Arrows */}
//           {category.length > 1 && (
//             <>
//               <button
//                 onClick={prevImage}
//                 className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white"
//               >
//                 <svg
//                   className="w-6 h-6"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M15 19l-7-7 7-7"
//                   />
//                 </svg>
//               </button>
//               <button
//                 onClick={nextImage}
//                 className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white"
//               >
//                 <svg
//                   className="w-6 h-6"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M9 5l7 7-7 7"
//                   />
//                 </svg>
//               </button>

//               {/* Dots Indicator */}
//               <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
//                 {category.map((_, index) => (
//                   <button
//                     key={index}
//                     onClick={() => setCurrentIndex(index)}
//                     className={`w-3 h-3 rounded-full transition-colors ${
//                       index === currentIndex ? "bg-white" : "bg-white/40"
//                     }`}
//                   />
//                 ))}
//               </div>
//             </>
//           )}
//         </div>

//         {/* Counter */}
//         <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-white text-center">
//           <p className="text-sm opacity-70">
//             {currentIndex + 1} of {category.length}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Model;

import React, { useState, useEffect } from "react";

const Model = ({ category, setIsModalOpen, handleModalBackgroundClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemDimensions, setItemDimensions] = useState({});
  const [isMobile, setIsMobile] = useState(false); // 🔥 Mobile state

  if (!category || !Array.isArray(category)) {
    return null;
  }

  // 🔥 Detect mobile screen
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768); // Tailwind md breakpoint
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const isReelsFormat = (index) => {
    const dimensions = itemDimensions[index];
    return dimensions && dimensions.height > dimensions.width;
  };

  const loadDimensions = (item, index) => {
    if (item?.type === "video") {
      const video = document.createElement("video");
      video.onloadedmetadata = () => {
        setItemDimensions((prev) => ({
          ...prev,
          [index]: { width: video.videoWidth, height: video.videoHeight },
        }));
      };
      video.src = item.src;
    } else {
      const img = new Image();
      img.onload = () => {
        setItemDimensions((prev) => ({
          ...prev,
          [index]: { width: img.width, height: img.height },
        }));
      };
      img.src = item?.src || item;
    }
  };

  useEffect(() => {
    category.forEach((item, index) => {
      loadDimensions(item, index);
    });
  }, [category]);

  const nextImage = () => {
    const currentIsReels = isReelsFormat(currentIndex);
    let nextIndex = currentIndex + 1;

    // 🔥 Only skip 2 if NOT mobile
    if (
      !isMobile &&
      currentIsReels &&
      currentIndex + 1 < category.length &&
      isReelsFormat(currentIndex + 1)
    ) {
      nextIndex = currentIndex + 2;
    }

    setCurrentIndex(nextIndex % category.length);
  };

  const prevImage = () => {
    let prevIndex = currentIndex - 1;

    // 🔥 Only go back by 2 if NOT mobile
    if (
      !isMobile &&
      prevIndex >= 0 &&
      isReelsFormat(prevIndex) &&
      prevIndex > 0 &&
      isReelsFormat(prevIndex - 1)
    ) {
      prevIndex = currentIndex - 2;
    }

    if (prevIndex < 0) {
      prevIndex = category.length - 1;
    }

    setCurrentIndex(prevIndex);
  };

  const currentItem = category[currentIndex];
  const nextItem = category[currentIndex + 1];
  const shouldShowTwoItems =
    !isMobile && // 🔥 Never show 2 items on mobile
    isReelsFormat(currentIndex) &&
    nextItem &&
    isReelsFormat(currentIndex + 1);

  const renderMediaItem = (item, index, className = "") => {
    if (!item) return null;

    if (item?.type === "video") {
      return (
        <video
          key={`video-${index}`}
          src={item.src}
          className={`max-h-[800px] object-contain rounded-xl shadow-md ${className}`}
          autoPlay
          loop
          muted
          playsInline
          controls
        />
      );
    } else {
      return (
        <img
          key={`img-${index}`}
          src={item?.src || item}
          alt={`Gallery item ${index + 1}`}
          className={`max-h-[800px] object-contain rounded-xl shadow-md transition-transform duration-300 hover:scale-105 ${className}`}
        />
      );
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 transition-all duration-500"
      onClick={handleModalBackgroundClick}
    >
      <div className="relative max-w-7xl max-h-full transition-all duration-500">
        {/* Close Button */}
        <button
          onClick={() => setIsModalOpen(false)}
          className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors duration-200 z-10"
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Main Content */}
        <div className="relative">
          <div className="flex items-center justify-center w-full h-full">
            {shouldShowTwoItems ? (
              // Two reels (desktop only)
              <div className="flex gap-4 items-center justify-center">
                {renderMediaItem(currentItem, currentIndex, "max-w-[400px]")}
                {renderMediaItem(nextItem, currentIndex + 1, "max-w-[400px]")}
              </div>
            ) : (
              // Single item (mobile or landscape)
              <div className="flex items-center justify-center w-full">
                {renderMediaItem(currentItem, currentIndex, "max-w-full")}
              </div>
            )}
          </div>

          {/* Navigation Arrows */}
          {category.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 
                           w-8 h-8 md:w-12 md:h-12 flex items-center justify-center 
                           rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white"
              >
                <svg
                  className="w-4 h-4 md:w-6 md:h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
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
                onClick={nextImage}
                className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 
                           w-8 h-8 md:w-12 md:h-12 flex items-center justify-center 
                           rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white"
              >
                <svg
                  className="w-4 h-4 md:w-6 md:h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>

              {/* Dots Indicator */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                {category.map((_, index) => {
                  const isActive = shouldShowTwoItems
                    ? index === currentIndex || index === currentIndex + 1
                    : index === currentIndex;

                  return (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`transition-colors w-3 h-3 rounded-full ${
                        isActive ? "bg-white" : "bg-white/40"
                      }`}
                    />
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Counter */}
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-white text-center">
          <p className="text-sm opacity-70">
            {shouldShowTwoItems
              ? `${currentIndex + 1}-${currentIndex + 2} of ${category.length}`
              : `${currentIndex + 1} of ${category.length}`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Model;

// 2nd part

// import React, { useState, useEffect } from "react";
// import { Play, X, ChevronLeft, ChevronRight } from "lucide-react";

// const Model = ({ category, setIsModalOpen, handleModalBackgroundClick }) => {
//   const [currentIndex, setCurrentIndex] = useState(0);

//   if (!category || !Array.isArray(category)) {
//     return null;
//   }

//   const currentItem = category[currentIndex];

//   const nextItem = () => {
//     setCurrentIndex((prev) => (prev + 1) % category.length);
//   };

//   const prevItem = () => {
//     setCurrentIndex((prev) => (prev - 1 + category.length) % category.length);
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === "Escape") setIsModalOpen(false);
//     if (e.key === "ArrowRight") nextItem();
//     if (e.key === "ArrowLeft") prevItem();
//   };

//   useEffect(() => {
//     window.addEventListener("keydown", handleKeyPress);
//     return () => window.removeEventListener("keydown", handleKeyPress);
//   });

//   return (
//     <div
//       className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center"
//       onClick={handleModalBackgroundClick}
//     >
//       {/* Close Button */}
//       <button
//         onClick={() => setIsModalOpen(false)}
//         className="absolute top-6 right-6 z-10 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
//       >
//         <X className="w-6 h-6 text-white" />
//       </button>

//       {/* Navigation Buttons */}
//       {category.length > 1 && (
//         <>
//           <button
//             onClick={prevItem}
//             className="absolute left-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
//           >
//             <ChevronLeft className="w-6 h-6 text-white" />
//           </button>
//           <button
//             onClick={nextItem}
//             className="absolute right-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
//           >
//             <ChevronRight className="w-6 h-6 text-white" />
//           </button>
//         </>
//       )}

//       {/* Main Content */}
//       <div className="flex flex-col items-center max-w-7xl max-h-full p-4">
//         {currentItem?.type === "video" ? (
//           <video
//             key={currentIndex}
//             src={currentItem.src}
//             className="max-h-[80vh] max-w-full object-contain rounded-xl shadow-2xl"
//             autoPlay
//             controls
//             loop
//             muted
//           />
//         ) : (
//           <img
//             key={currentIndex}
//             src={currentItem?.src || currentItem}
//             alt={`Item ${currentIndex + 1}`}
//             className="max-h-[80vh] max-w-full object-contain rounded-xl shadow-2xl"
//           />
//         )}

//         {/* Counter */}
//         <div className="mt-4 text-center">
//           <p className="text-white/70 text-sm">
//             {currentIndex + 1} of {category.length}
//           </p>
//         </div>
//       </div>

//       {/* Thumbnail Navigation */}
//       {category.length > 1 && (
//         <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3 max-w-screen-lg overflow-x-auto px-4">
//           {category.map((item, index) => (
//             <button
//               key={index}
//               onClick={() => setCurrentIndex(index)}
//               className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden transition-all duration-200 ${
//                 index === currentIndex
//                   ? "ring-2 ring-white scale-110"
//                   : "opacity-60 hover:opacity-80"
//               }`}
//             >
//               <img
//                 src={item.type === "video" ? item.thumbnail : item.src}
//                 alt={`thumb-${index}`}
//                 className="w-full h-full object-cover"
//               />
//               {item.type === "video" && (
//                 <div className="absolute inset-0 flex items-center justify-center">
//                   <Play className="w-4 h-4 text-white" fill="white" />
//                 </div>
//               )}
//             </button>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Model;

// 4th part

// import React, { useState } from "react";
// import { X, Play } from "lucide-react";

// const Model = ({ category, setIsModalOpen }) => {
//   const [previewItem, setPreviewItem] = useState(null);

//   if (!category || !Array.isArray(category)) return null;

//   return (
//     <>
//       {/* First Modal - Gallery Grid */}
//       <div className="fixed inset-0 z-40 bg-black/90 backdrop-blur-md overflow-y-auto p-6 flex flex-col">
//         {/* Close Button */}
//         <button
//           onClick={() => setIsModalOpen(false)}
//           className="absolute top-6 right-6 z-50 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition"
//         >
//           <X className="w-6 h-6 text-white" />
//         </button>

//         {/* Masonry Layout */}
//         <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4 max-w-7xl mx-auto mt-12">
//           {category.map((item, idx) => (
//             <div
//               key={idx}
//               className="relative group cursor-pointer overflow-hidden rounded-2xl shadow-lg transition-transform hover:scale-[1.02] hover:shadow-xl"
//               onClick={() => setPreviewItem(item)}
//             >
//               {/* Show video preview or image */}
//               {item.type === "video" ? (
//                 <video
//                   src={item.src}
//                   muted
//                   loop
//                   playsInline
//                   autoPlay
//                   className="w-full h-auto rounded-2xl object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-300"
//                 />
//               ) : (
//                 <img
//                   src={item.src}
//                   alt={item.title || `image-${idx}`}
//                   className="w-full h-auto rounded-2xl object-cover transition-transform duration-300 group-hover:scale-105"
//                 />
//               )}

//               {/* Optional overlay for videos */}
//               {item.type === "video" && (
//                 <div className="absolute inset-0 flex items-center justify-center">
//                   <Play className="w-10 h-10 text-white opacity-70 group-hover:opacity-100 transition-opacity" />
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Second Modal - Preview */}
//       {previewItem && (
//         <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
//           {/* Close Button */}
//           <button
//             onClick={() => setPreviewItem(null)}
//             className="absolute top-6 right-6 z-50 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition"
//           >
//             <X className="w-6 h-6 text-white" />
//           </button>

//           {/* Preview Content */}
//           <div className="max-w-6xl w-full flex items-center justify-center">
//             {previewItem.type === "video" ? (
//               <video
//                 src={previewItem.src}
//                 autoPlay
//                 controls
//                 loop
//                 className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl"
//               />
//             ) : (
//               <img
//                 src={previewItem.src}
//                 alt={previewItem.title}
//                 className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl object-contain"
//               />
//             )}
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default Model;
