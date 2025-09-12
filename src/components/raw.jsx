// import React, { useEffect, useRef, useState } from "react";
// import bannerVideo from "../assets/bannerVideo.mp4";
// import bannerImg from "../assets/bannerImg.JPG";

// const HorizontalScrollGallery = () => {
//   const containerRef = useRef(null);
//   const galleryRef = useRef(null);
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const webglRefs = useRef([]);
//   const distortionEffects = useRef([]);

//   // Sample images - replace with your actual image URLs
//   const images = [
//     "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop", // House
//     "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop", // House interior
//     "https://images.unsplash.com/photo-1600566753053-38174a6b7c5e?w=800&h=600&fit=crop", // Modern house
//     "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop", // Luxury home
//     "https://images.unsplash.com/photo-1628744404730-5e143358539b?w=800&h=600&fit=crop", // Kitchen
//     "https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?w=800&h=600&fit=crop", // Bathroom
//     "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800&h=600&fit=crop", // Living room
//     "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&h=600&fit=crop", // House exterior
//   ];

//   // WebGL Distortion Effect Class - Professional Implementation
//   class WebGLDistortion {
//     constructor(canvas, imageSrc) {
//       this.canvas = canvas;
//       this.gl =
//         canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
//       this.imageSrc = imageSrc;
//       this.texture = null;
//       this.program = null;
//       this.mouse = { x: 0, y: 0 };
//       this.targetMouse = { x: 0, y: 0 };
//       this.time = 0;
//       this.animationId = null;

//       if (!this.gl) {
//         console.warn("WebGL not supported, falling back to regular canvas");
//         return;
//       }

//       this.init();
//     }

//     init() {
//       this.setupShaders();
//       this.loadTexture();
//       this.setupGeometry();
//       this.render();
//     }

//     setupShaders() {
//       // Vertex shader - positions the geometry
//       const vertexShaderSource = `
//         attribute vec2 a_position;
//         attribute vec2 a_texCoord;
//         varying vec2 v_texCoord;

//         void main() {
//           gl_Position = vec4(a_position, 0.0, 1.0);
//           v_texCoord = a_texCoord;
//         }
//       `;

//       // Fragment shader - creates the distortion effect
//       const fragmentShaderSource = `
//         precision mediump float;
//         uniform sampler2D u_texture;
//         uniform vec2 u_mouse;
//         uniform float u_time;
//         uniform vec2 u_resolution;
//         varying vec2 v_texCoord;

//         void main() {
//           vec2 uv = v_texCoord;

//           // Calculate distance from mouse position
//           vec2 mousePos = u_mouse / u_resolution;
//           mousePos.y = 1.0 - mousePos.y; // Flip Y coordinate

//           float dist = distance(uv, mousePos);

//           // Create ripple effect
//           float ripple = sin(dist * 30.0 - u_time * 8.0) * 0.5 + 0.5;
//           ripple *= smoothstep(0.3, 0.0, dist);

//           // Create wave distortion
//           float wave = sin(uv.x * 10.0 + u_time * 2.0) * 0.01;
//           wave += sin(uv.y * 15.0 + u_time * 1.5) * 0.008;

//           // Mouse interaction distortion
//           vec2 mouseDistortion = vec2(0.0);
//           if (dist < 0.3) {
//             float intensity = (0.3 - dist) / 0.3;
//             float angle = atan(mousePos.y - uv.y, mousePos.x - uv.x);
//             mouseDistortion = vec2(cos(angle), sin(angle)) * intensity * 0.03;
//             mouseDistortion *= sin(u_time * 5.0) * 0.5 + 0.5;
//           }

//           // Combine all distortions
//           vec2 distortedUV = uv + mouseDistortion;
//           distortedUV.x += wave;
//           distortedUV.y += wave * 0.7;

//           // Add chromatic aberration for premium feel
//           float aberration = ripple * 0.005;
//           vec4 color;
//           color.r = texture2D(u_texture, distortedUV + vec2(aberration, 0.0)).r;
//           color.g = texture2D(u_texture, distortedUV).g;
//           color.b = texture2D(u_texture, distortedUV - vec2(aberration, 0.0)).b;
//           color.a = 1.0;

//           // Add subtle glow effect
//           float glow = ripple * 0.2;
//           color.rgb += glow;

//           gl_FragColor = color;
//         }
//       `;

//       const vertexShader = this.createShader(
//         this.gl.VERTEX_SHADER,
//         vertexShaderSource
//       );
//       const fragmentShader = this.createShader(
//         this.gl.FRAGMENT_SHADER,
//         fragmentShaderSource
//       );

//       this.program = this.createProgram(vertexShader, fragmentShader);
//       this.gl.useProgram(this.program);
//     }

//     createShader(type, source) {
//       const shader = this.gl.createShader(type);
//       this.gl.shaderSource(shader, source);
//       this.gl.compileShader(shader);

//       if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
//         console.error(
//           "Shader compile error:",
//           this.gl.getShaderInfoLog(shader)
//         );
//         return null;
//       }

//       return shader;
//     }

//     createProgram(vertexShader, fragmentShader) {
//       const program = this.gl.createProgram();
//       this.gl.attachShader(program, vertexShader);
//       this.gl.attachShader(program, fragmentShader);
//       this.gl.linkProgram(program);

//       if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
//         console.error(
//           "Program link error:",
//           this.gl.getProgramInfoLog(program)
//         );
//         return null;
//       }

//       return program;
//     }

//     setupGeometry() {
//       // Create a full-screen quad
//       const positions = [-1, -1, 1, -1, -1, 1, 1, 1];

//       const texCoords = [0, 0, 1, 0, 0, 1, 1, 1];

//       // Position buffer
//       const positionBuffer = this.gl.createBuffer();
//       this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
//       this.gl.bufferData(
//         this.gl.ARRAY_BUFFER,
//         new Float32Array(positions),
//         this.gl.STATIC_DRAW
//       );

//       const positionLocation = this.gl.getAttribLocation(
//         this.program,
//         "a_position"
//       );
//       this.gl.enableVertexAttribArray(positionLocation);
//       this.gl.vertexAttribPointer(
//         positionLocation,
//         2,
//         this.gl.FLOAT,
//         false,
//         0,
//         0
//       );

//       // Texture coordinate buffer
//       const texCoordBuffer = this.gl.createBuffer();
//       this.gl.bindBuffer(this.gl.ARRAY_BUFFER, texCoordBuffer);
//       this.gl.bufferData(
//         this.gl.ARRAY_BUFFER,
//         new Float32Array(texCoords),
//         this.gl.STATIC_DRAW
//       );

//       const texCoordLocation = this.gl.getAttribLocation(
//         this.program,
//         "a_texCoord"
//       );
//       this.gl.enableVertexAttribArray(texCoordLocation);
//       this.gl.vertexAttribPointer(
//         texCoordLocation,
//         2,
//         this.gl.FLOAT,
//         false,
//         0,
//         0
//       );
//     }

//     loadTexture() {
//       const image = new Image();
//       image.crossOrigin = "anonymous";

//       image.onload = () => {
//         this.texture = this.gl.createTexture();
//         this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);

//         // Set texture parameters
//         this.gl.texParameteri(
//           this.gl.TEXTURE_2D,
//           this.gl.TEXTURE_WRAP_S,
//           this.gl.CLAMP_TO_EDGE
//         );
//         this.gl.texParameteri(
//           this.gl.TEXTURE_2D,
//           this.gl.TEXTURE_WRAP_T,
//           this.gl.CLAMP_TO_EDGE
//         );
//         this.gl.texParameteri(
//           this.gl.TEXTURE_2D,
//           this.gl.TEXTURE_MIN_FILTER,
//           this.gl.LINEAR
//         );
//         this.gl.texParameteri(
//           this.gl.TEXTURE_2D,
//           this.gl.TEXTURE_MAG_FILTER,
//           this.gl.LINEAR
//         );

//         // Upload the image
//         this.gl.texImage2D(
//           this.gl.TEXTURE_2D,
//           0,
//           this.gl.RGBA,
//           this.gl.RGBA,
//           this.gl.UNSIGNED_BYTE,
//           image
//         );
//       };

//       image.src = this.imageSrc;
//     }

//     updateMouse(x, y) {
//       this.targetMouse.x = x;
//       this.targetMouse.y = y;
//     }

//     render() {
//       if (!this.gl || !this.program || !this.texture) {
//         this.animationId = requestAnimationFrame(() => this.render());
//         return;
//       }

//       // Smooth mouse movement
//       this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.1;
//       this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.1;

//       this.time += 0.016; // ~60fps

//       // Set viewport
//       const rect = this.canvas.getBoundingClientRect();
//       this.canvas.width = rect.width;
//       this.canvas.height = rect.height;
//       this.gl.viewport(0, 0, rect.width, rect.height);

//       // Clear
//       this.gl.clearColor(0, 0, 0, 1);
//       this.gl.clear(this.gl.COLOR_BUFFER_BIT);

//       // Use our shader program
//       this.gl.useProgram(this.program);

//       // Set uniforms
//       const mouseLocation = this.gl.getUniformLocation(this.program, "u_mouse");
//       const timeLocation = this.gl.getUniformLocation(this.program, "u_time");
//       const resolutionLocation = this.gl.getUniformLocation(
//         this.program,
//         "u_resolution"
//       );

//       this.gl.uniform2f(mouseLocation, this.mouse.x, this.mouse.y);
//       this.gl.uniform1f(timeLocation, this.time);
//       this.gl.uniform2f(resolutionLocation, rect.width, rect.height);

//       // Bind texture
//       this.gl.activeTexture(this.gl.TEXTURE0);
//       this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);

//       const textureLocation = this.gl.getUniformLocation(
//         this.program,
//         "u_texture"
//       );
//       this.gl.uniform1i(textureLocation, 0);

//       // Draw
//       this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);

//       this.animationId = requestAnimationFrame(() => this.render());
//     }

//     destroy() {
//       if (this.animationId) {
//         cancelAnimationFrame(this.animationId);
//       }

//       if (this.gl) {
//         if (this.texture) this.gl.deleteTexture(this.texture);
//         if (this.program) this.gl.deleteProgram(this.program);
//       }
//     }
//   }

//   useEffect(() => {
//     // Import GSAP and ScrollTrigger
//     const script1 = document.createElement("script");
//     script1.src =
//       "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js";
//     document.head.appendChild(script1);

//     const script2 = document.createElement("script");
//     script2.src =
//       "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js";
//     document.head.appendChild(script2);

//     script2.onload = () => {
//       const { gsap } = window;
//       gsap.registerPlugin(window.ScrollTrigger);

//       const gallery = galleryRef.current;
//       const container = containerRef.current;

//       if (!gallery || !container) return;

//       // Calculate total width needed to scroll
//       const totalWidth = gallery.scrollWidth - window.innerWidth;

//       // Create horizontal scroll animation
//       const scrollTween = gsap.to(gallery, {
//         x: -totalWidth,
//         ease: "none",
//         duration: 1,
//       });

//       // ScrollTrigger configuration
//       window.ScrollTrigger.create({
//         trigger: container,
//         start: "top top",
//         end: () => `+=${totalWidth}`,
//         pin: true,
//         scrub: 1,
//         animation: scrollTween,
//         snap: {
//           snapTo: (progress) => {
//             const snapProgress = Math.round(progress * 7) / 7;
//             return snapProgress;
//           },
//           duration: 0.3,
//           delay: 0.1,
//         },
//         onUpdate: (self) => {
//           const dots = document.querySelectorAll("[id^='dot-']");
//           dots.forEach((dot, index) => {
//             if (index / 7 <= self.progress) {
//               dot.classList.add("bg-amber-400");
//               dot.classList.remove("bg-white/30");
//             } else {
//               dot.classList.remove("bg-amber-400");
//               dot.classList.add("bg-white/30");
//             }
//           });
//         },
//       });

//       // Cleanup function
//       return () => {
//         if (window.ScrollTrigger) {
//           window.ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
//         }
//         document.head.removeChild(script1);
//         document.head.removeChild(script2);
//       };
//     };
//   }, []);

//   const setupWebGLEffect = (canvas, imageSrc, index) => {
//     if (!canvas) return;

//     const distortion = new WebGLDistortion(canvas, imageSrc);
//     distortionEffects.current[index] = distortion;

//     const handleMouseMove = (e) => {
//       const rect = canvas.getBoundingClientRect();
//       const x = e.clientX - rect.left;
//       const y = e.clientY - rect.top;
//       distortion.updateMouse(x, y);
//     };

//     const handleMouseEnter = (e) => {
//       const rect = canvas.getBoundingClientRect();
//       const x = e.clientX - rect.left;
//       const y = e.clientY - rect.top;
//       distortion.updateMouse(x, y);
//     };

//     const handleMouseLeave = () => {
//       distortion.updateMouse(-100, -100); // Move mouse off screen
//     };

//     canvas.addEventListener("mouseenter", handleMouseEnter);
//     canvas.addEventListener("mousemove", handleMouseMove);
//     canvas.addEventListener("mouseleave", handleMouseLeave);

//     // Store cleanup function
//     canvas._cleanup = () => {
//       distortion.destroy();
//       canvas.removeEventListener("mouseenter", handleMouseEnter);
//       canvas.removeEventListener("mousemove", handleMouseMove);
//       canvas.removeEventListener("mouseleave", handleMouseLeave);
//     };
//   };

//   useEffect(() => {
//     // Setup WebGL distortion effect for each canvas
//     webglRefs.current.forEach((canvas, index) => {
//       if (canvas && images[index]) {
//         setupWebGLEffect(canvas, images[index], index);
//       }
//     });

//     // Cleanup on unmount
//     return () => {
//       webglRefs.current.forEach((canvas) => {
//         if (canvas && canvas._cleanup) {
//           canvas._cleanup();
//         }
//       });
//       distortionEffects.current.forEach((effect) => {
//         if (effect) effect.destroy();
//       });
//     };
//   }, []);

//   const openModal = (imageSrc) => {
//     setSelectedImage(imageSrc);
//     setIsModalOpen(true);
//     document.body.style.overflow = "hidden";
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setSelectedImage(null);
//     document.body.style.overflow = "auto";
//   };

//   const handleModalBackgroundClick = (e) => {
//     if (e.target === e.currentTarget) {
//       closeModal();
//     }
//   };

//   return (
//     <div className="relative w-screen">
//       {/* Horizontal Scroll Gallery Container */}
//       <div
//         ref={containerRef}
//         className="relative min-h-screen overflow-hidden bg-black"
//       >
//         <div
//           ref={galleryRef}
//           className="flex h-screen will-change-transform"
//           style={{ width: `${images.length * 100}vw` }}
//         >
//           {images.map((src, index) => (
//             <div
//               key={index}
//               className="relative w-screen h-screen flex items-center justify-center p-4"
//             >
//               {/* Background blurred image - full coverage */}
//               <div className="absolute inset-0 opacity-50">
//                 <img
//                   src={src}
//                   alt=""
//                   className="w-full h-full object-cover filter blur-md"
//                 />
//                 <div className="absolute inset-0 bg-black/30" />
//               </div>

//               {/* Center focused image with WebGL distortion */}
//               <div className="relative z-10 group cursor-pointer w-full max-w-6xl mx-auto">
//                 <div className="relative w-full h-[70vh] max-h-[600px] rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 group-hover:shadow-3xl">
//                   {/* WebGL Canvas for distortion effect */}
//                   <canvas
//                     ref={(el) => (webglRefs.current[index] = el)}
//                     className="absolute inset-0 w-full h-full cursor-pointer rounded-2xl"
//                     onClick={() => openModal(src)}
//                     style={{
//                       width: "100%",
//                       height: "100%",
//                       display: "block",
//                     }}
//                   />

//                   {/* Fallback image (hidden but helps with loading) */}
//                   <img
//                     src={src}
//                     alt={`Property image ${index + 1}`}
//                     className="w-full h-full object-cover opacity-0 pointer-events-none"
//                     loading="lazy"
//                   />

//                   {/* Gradient overlay */}
//                   <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
//                 </div>

//                 {/* Image info overlay */}
//                 <div className="absolute bottom-6 left-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
//                   <p className="text-lg font-semibold">Property {index + 1}</p>
//                   <p className="text-sm text-gray-200">
//                     Move your mouse to distort
//                   </p>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Scroll Progress Indicator */}
//         <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-10">
//           <div className="flex space-x-2">
//             {images.map((_, index) => (
//               <div
//                 key={index}
//                 className="w-2 h-2 rounded-full bg-white/30 transition-all duration-300"
//                 id={`dot-${index}`}
//               />
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Post-scroll content */}
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
//       {isModalOpen && (
//         <div
//           className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
//           onClick={handleModalBackgroundClick}
//         >
//           <div className="relative max-w-7xl max-h-full">
//             {/* Close Button */}
//             <button
//               onClick={closeModal}
//               className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors duration-200 z-10"
//               aria-label="Close modal"
//             >
//               <svg
//                 className="w-8 h-8"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M6 18L18 6M6 6l12 12"
//                 />
//               </svg>
//             </button>

//             {/* Modal Image */}
//             <img
//               src={selectedImage}
//               alt="Enlarged property image"
//               className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
//               onClick={(e) => e.stopPropagation()}
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default HorizontalScrollGallery;
