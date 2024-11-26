import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';


// Carousel Images
import carouselImage1 from '../images/carousel1.jpg';
import carouselImage2 from '../images/carousel2.jpg';
import carouselImage3 from '../images/carousel3.jpg';

// Course Images
import digitalLiteracy from '../images/digital.jpg';
import computerBasics from '../images/basics.jpg';
import webDev from '../images/web.jpg';
import mobileDev from '../images/app.jpg';
import dataSci from '../images/datascience.jpg';
import graphicDesign from '../images/graphic.jpg';
import uiuxDesign from '../images/uiux.jpg';
import threeDModeling from '../images/3D.jpg';
import digitalMarketing from '../images/dmarket.jpg';
import entrepreneurship from '../images/project.jpg';
import projectManagement from '../images/project.jpg';

// Logo
import SkillPulseLogo from '../images/logo.jpg';

const LandingPage = ({ onLogin }) => {
  const [activeSection, setActiveSection] = useState('home');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const sectionRefs = {
    home: useRef(null),
    courses: useRef(null),
    about: useRef(null),
    testimonials: useRef(null),
    contact: useRef(null)
  };

  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);

  const carouselItems = [
    {
      title: "Elevate Your Digital Skills",
      description: "Transform Your Potential with SkillPulse",
      buttonText: "Start Learning",
      image: carouselImage1
    },
    {
      title: "Innovation Meets Education",
      description: "Cutting-Edge Courses for Modern Professionals",
      buttonText: "Explore Courses",
      image: carouselImage2
    },
    {
      title: "Learn. Grow. Succeed.",
      description: "Your Path to Tech Mastery Starts Here",
      buttonText: "Begin Journey",
      image: carouselImage3
    }
  ];

  const courseGroups = [
    {
      title: "Tech Fundamentals",
      courses: [
        { 
          title: "Digital Literacy", 
          image: digitalLiteracy, 
          description: "Master essential digital skills for the modern world." 
        },
        { 
          title: "Computer Basics", 
          image: computerBasics, 
          description: "Build a strong foundation in computer technologies." 
        },
      ]
    },
    {
      title: "Programming & Development",
      courses: [
        { 
          title: "Web Development", 
          image: webDev, 
          description: "Create responsive and dynamic web applications." 
        },
        { 
          title: "Mobile App Development", 
          image: mobileDev, 
          description: "Design innovative mobile experiences." 
        },
        { 
          title: "Data Science", 
          image: dataSci, 
          description: "Unlock insights through advanced data analysis." 
        },
      ]
    },
    {
      title: "Design & Creativity",
      courses: [
        { 
          title: "Graphic Design", 
          image: graphicDesign, 
          description: "Craft visually stunning digital art and designs." 
        },
        { 
          title: "UX/UI Design", 
          image: uiuxDesign, 
          description: "Create intuitive and beautiful user interfaces." 
        },
        { 
          title: "3D Modeling", 
          image: threeDModeling, 
          description: "Bring imagination to life through 3D visualization." 
        },
      ]
    },
    {
      title: "Business & Strategy",
      courses: [
        { 
          title: "Digital Marketing", 
          image: digitalMarketing, 
          description: "Master modern marketing strategies and techniques." 
        },
        { 
          title: "Entrepreneurship", 
          image: entrepreneurship, 
          description: "Learn to build and scale innovative tech startups." 
        },
        { 
          title: "Project Management", 
          image: projectManagement, 
          description: "Lead projects with precision and effectiveness." 
        },
      ]
    },
  ];

  const testimonials = [
    { 
      message: "SkillPulse transformed my career trajectory completely!", 
      name: "Alex Johnson", 
      course: "Web Development" 
    },
    { 
      message: "The UX course was a game-changer for my professional growth.", 
      name: "Sophia Lee", 
      course: "UX/UI Design" 
    },
    { 
      message: "I launched my startup after taking the entrepreneurship course.", 
      name: "Omar Hassan", 
      course: "Entrepreneurship" 
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % carouselItems.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  // Enhanced scroll to section function
  const scrollToSection = (sectionId) => {
    const element = sectionRefs[sectionId].current;
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
      setActiveSection(sectionId);
    }
  };

  // Navbar Item Component with Advanced Hover
  const NavbarItem = ({ children, sectionId }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <motion.a
        onClick={() => scrollToSection(sectionId)}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className={`cursor-pointer relative overflow-hidden px-3 py-2 ${
          activeSection === sectionId ? 'text-blue-300' : 'text-white'
        }`}
      >
        {children}
        <motion.div 
          initial={{ width: 0 }}
          animate={{ 
            width: isHovered ? '100%' : 0,
            transition: { duration: 0.3 }
          }}
          className="absolute bottom-0 left-0 h-0.5 bg-blue-400"
        />
      </motion.a>
    );
  };

  return (
    <div className="bg-[#0a173b] min-h-screen text-white">
      {/* Navbar with Enhanced Hover */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a173b]/80 backdrop-blur-md">
        <div className="container mx-auto flex justify-between items-center p-4">
          <div className="flex items-center space-x-4">
            <img src={SkillPulseLogo} alt="SkillPulse Logo" className="h-10 w-10 rounded-full" />
            <span className="text-2xl font-bold text-white">SkillPulse</span>
          </div>
          <div className="flex space-x-6">
            <NavbarItem sectionId="home">Home</NavbarItem>
            <NavbarItem sectionId="courses">Courses</NavbarItem>
            <NavbarItem sectionId="about">About</NavbarItem>
            <NavbarItem sectionId="testimonials">Success Stories</NavbarItem>
            <NavbarItem sectionId="contact">Contact</NavbarItem>
          </div>
        </div>
      </nav>

      {/* Hero Carousel */}
      <div ref={sectionRefs.home} className="relative h-[80vh] pt-16 overflow-hidden">
        {carouselItems.map((item, index) => (
          <motion.div
            key={index}
            className={`absolute inset-0 flex items-center justify-center ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
            initial={{ opacity: 0, scale: 1.2 }}
            animate={{ 
              opacity: index === currentSlide ? 1 : 0, 
              scale: index === currentSlide ? 1 : 1.2 
            }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <div className="absolute inset-0">
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-full object-cover opacity-40" 
              />
            </div>
            <div className="relative z-10 text-center px-4 max-w-4xl">
              <motion.h1 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg"
              >
                {item.title}
              </motion.h1>
              <motion.p 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-xl md:text-2xl mb-8 drop-shadow-md"
              >
                {item.description}
              </motion.p>
              <motion.button 
                onClick={onLogin} 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="bg-blue-500 text-white px-10 py-4 rounded-full text-lg font-semibold 
                           hover:bg-blue-600 transition duration-300 shadow-xl"
              >
                {item.buttonText}
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Course Groups */}
      <motion.div 
        ref={sectionRefs.courses}
        id="courses"
        style={{ scale }}
        className="container mx-auto py-16 px-4"
      >
        <h2 className="text-4xl font-bold text-center mb-16 text-blue-200">Explore Our Courses</h2>
        {courseGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="mb-16">
            <h3 className="text-2xl font-semibold mb-8 text-blue-300">{group.title}</h3>
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ amount: 0.2, once: true }}
              variants={{
                hidden: { opacity: 0 },
                visible: { 
                  opacity: 1,
                  transition: {
                    delayChildren: 0.3,
                    staggerChildren: 0.1
                  }
                }
              }}
            >
              {group.courses.map((course, courseIndex) => (
                <motion.div
                  key={courseIndex}
                  variants={{
                    hidden: { 
                      y: 50, 
                      opacity: 0, 
                      rotateX: -30,
                      scale: 0.8
                    },
                    visible: { 
                      y: 0, 
                      opacity: 1,
                      rotateX: 0,
                      scale: 1,
                      transition: { 
                        type: "spring",
                        damping: 12,
                        stiffness: 200,
                        duration: 0.5
                      }
                    }
                  }}
                  whileHover={{
                    scale: 1.05,
                    rotate: [0, -2, 2, 0],
                    transition: { 
                      type: "spring", 
                      stiffness: 300 
                    }
                  }}
                  className="bg-blue-900/30 backdrop-blur-lg rounded-xl shadow-lg overflow-hidden transform transition-all"
                >
                  <img 
                    src={course.image} 
                    alt={course.title} 
                    className="w-full h-48 object-cover" 
                  />
                  <div className="p-6">
                    <h4 className="text-xl font-semibold mb-2 text-blue-200">{course.title}</h4>
                    <p className="text-blue-100 mb-4">{course.description}</p>
                    <button className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition duration-300">
                      Learn More
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        ))}
      </motion.div>

      {/* About Section */}
      <div ref={sectionRefs.about} id="about" className="container mx-auto py-16 px-4 bg-[#0a173b]">
        <h2 className="text-4xl font-bold text-center mb-12 text-blue-200">About SkillPulse</h2>
        <div className="max-w-4xl mx-auto text-center text-blue-100">
          <p className="text-xl leading-relaxed">
            SkillPulse is more than just an online learning platform. We're a community of passionate learners and industry experts dedicated to transforming digital education. Our mission is to empower individuals with cutting-edge skills that drive innovation and personal growth.
          </p>
        </div>
      </div>

      {/* Testimonials */}
      <div ref={sectionRefs.testimonials} id="testimonials" className="bg-[#0a173b] text- white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Success Stories</h2>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTestimonialIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ 
                type: "spring",
                stiffness: 300,
                damping: 30
              }}
              className="max-w-2xl mx-auto bg-white/10 backdrop-blur-lg text-white rounded-2xl p-12 shadow-2xl text-center"
            >
              <div className="text-6xl text-blue-400 mb-6 opacity-50">"</div>
              <p className="text-2xl italic mb-6 text-blue-50">
                {testimonials[currentTestimonialIndex].message}
              </p>
              <div className="border-t border-blue-700/50 pt-6">
                <p className="font-semibold text-xl text-blue-200">
                  {testimonials[currentTestimonialIndex].name}
                </p>
                <p className="text-blue-300">
                  {testimonials[currentTestimonialIndex].course} Graduate
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="flex justify-center mt-8">
            <button
              className="mx-2 p-3 bg-white/10 backdrop-blur-lg text-white rounded-full hover:bg-white/20 transition duration-300"
              onClick={() => setCurrentTestimonialIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
            >
              &#8592;
            </button>
            <button
              className="mx-2 p-3 bg-white/10 backdrop-blur-lg text-white rounded-full hover:bg-white/20 transition duration-300"
              onClick={() => setCurrentTestimonialIndex((prev) => (prev + 1) % testimonials.length)}
            >
              &#8594;
            </button>
          </div>
        </div>
      </div>

     
      {/* Contact Section */}
      <div ref={sectionRefs.contact} id="contact" className="container mx-auto py-16 px-4 bg-[#0a173b]">
        <h2 className="text-4xl font-bold text-center mb-12 text-white">Connect With Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <form className="space-y-4">
              <input 
                type="text" 
                placeholder="Your Name" 
                className="w-full p-3 bg-white/10 backdrop-blur-lg border border-blue-300 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
              />
              <input 
                type="email" 
                placeholder="Your Email" 
                className="w-full p-3 bg-white/10 backdrop-blur-lg border border-blue-300 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
              />
              <input 
                type="tel" 
                placeholder="Your Phone Number" 
                className="w-full p-3 bg-white/10 backdrop-blur-lg border border-blue-300 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
              />
              <textarea 
                placeholder="Your Message" 
                rows="5" 
                className="w-full p-3 bg-white/10 backdrop-blur-lg border border-blue-300 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
              <button 
                type="submit" 
                className="bg-white text-blue-900 px-8 py-3 rounded-full hover:bg-blue-50 transition duration-300"
              >
                Send Message
              </button>
            </form>
          </div>
          <div className="text-white">
            <h3 className="text-2xl font-semibold mb-6 text-blue-200">Get in Touch</h3>
            <p className="mb-4"><i className="fas fa-map-marker-alt mr-2 text-blue-400"></i> SkillPulse Campus, Innovation Drive, Tech City</p>
            <p className="mb-4"><i className="fas fa-phone mr-2 text-blue-400"></i> +1 (555) 123-4567</p>
            <p className="mb-4"><i className="fas fa-envelope mr-2 text-blue-400"></i> info@skillpulse.com</p>
            <div className="mt-8">
              <h4 className="text-xl font-semibold mb-4 text-blue-200">Follow Our Journey</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-blue-300 hover:text-blue-100 transition duration-300">
                  <i className="fab fa-facebook fa-2x"></i>
                </a>
                <a href="#" className="text-blue-300 hover:text-blue-100 transition duration-300">
                  <i className="fab fa-twitter fa-2x"></i>
                </a>
                <a href="#" className="text-blue-300 hover:text-blue-100 transition duration-300">
                  <i className="fab fa-instagram fa-2x"></i>
                </a>
                <a href="#" className="text-blue-300 hover:text-blue-100 transition duration-300">
                  <i className="fab fa-linkedin fa-2x"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
        </div>

      {/* Footer */}
<div ref={sectionRefs.footer} id="footer" className="bg-[#0a173b] text- white py-12"></div>
      <footer className="bg-blue-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-xl font-bold mb-4">SkillPulse</h4>
              <p className="text-blue-200">Empowering digital learners through innovative online education.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#home" className="hover:text-blue-300 transition">Home</a></li>
                <li><a href="#courses" className="hover:text-blue-300 transition">Courses</a></li>
                <li><a href="#about" className="hover:text-blue-300 transition">About</a></li>
                <li><a href="#testimonials" className="hover:text-blue-300 transition">Success Stories</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Connect</h4>
              <ul className="space-y-2">
                <li>+1 (555) 123-4567</li>
                <li>info@skillpulse.com</li>
                <li>Innovation Drive, Tech City</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-blue-300 hover:text-blue-100 transition"><i className="fab fa-facebook fa-2x"></i></a>
                <a href="#" className="text-blue-300 hover:text-blue-100 transition"><i className="fab fa-twitter fa-2x"></i></a>
                <a href="#" className="text-blue-300 hover:text-blue-100 transition"><i className="fab fa-instagram fa-2x"></i></a>
                <a href="#" className="text-blue-300 hover:text-blue-100 transition"><i className="fab fa-linkedin fa-2x"></i></a>
              </div>
            </div>
          </div>
          <div className="text-center mt-8 pt-8 border-t border-blue-800">
            <p>&copy; 2024 SkillPulse. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;