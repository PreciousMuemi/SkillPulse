import React, {useState, useEffect} from 'react';
import { motion } from 'framer-motion';

const LandingPage = ({ onLogin }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);

  const carouselItems = [
  {
    title: "Empower Your Future with SkillNet",
    description: "Connect, learn, and grow with our cutting-edge digital skills courses.",
    buttonText: "Start Your Journey",
  },
  {
    title: "Master In-Demand Tech Skills",
    description: "From coding to design, our expert-led courses prepare you for the digital economy.",
    buttonText: "Explore Courses",
  },
  {
    title: "Join a Community of Innovators",
    description: "Network with peers and mentors who are shaping the future of technology.",
    buttonText: "Join SkillNet",
  },
  ];

  const courseGroups = [
  {
    title: "Tech Fundamentals",
    courses: [
      { title: "Digital Literacy", image: "digital_literacy.webp", description: "Build a strong foundation in essential digital skills." },
      { title: "Computer Basics", image: "computer_basics.webp", description: "Master the fundamentals of computer usage and software." },
    ]
  },
  {
    title: "Programming & Development",
    courses: [
      { title: "Web Development", image: "web_dev.webp", description: "Create responsive websites with HTML, CSS, and JavaScript." },
      { title: "Mobile App Development", image: "mobile_dev.webp", description: "Build apps for iOS and Android platforms." },
      { title: "Data Science", image: "data_science.webp", description: "Analyze data and build machine learning models with Python." },
    ]
  },
  {
    title: "Design & Creativity",
    courses: [
      { title: "Graphic Design", image: "graphic_design.webp", description: "Create stunning visuals with industry-standard tools." },
      { title: "UX/UI Design", image: "ux_ui_design.webp", description: "Design intuitive and beautiful user interfaces." },
      { title: "3D Modeling", image: "3d_modeling.webp", description: "Bring your ideas to life with 3D modeling and animation." },
    ]
  },
  {
    title: "Business & Entrepreneurship",
    courses: [
      { title: "Digital Marketing", image: "digital_marketing.webp", description: "Master SEO, social media, and content marketing strategies." },
      { title: "Entrepreneurship", image: "entrepreneurship.webp", description: "Learn to build and grow your own tech startup." },
      { title: "Project Management", image: "project_management.webp", description: "Lead tech projects with agile methodologies." },
    ]
  },
  ];

  const testimonials = [
  { message: "SkillNet transformed my career. I'm now a successful full-stack developer!", name: "Alex Johnson", course: "Web Development" },
  { message: "The UX/UI course helped me land my dream job at a top tech company.", name: "Sophia Lee", course: "UX/UI Design" },
  { message: "Thanks to SkillNet, I launched my own successful digital marketing agency.", name: "Omar Hassan", course: "Digital Marketing" },
  ];

  useEffect(() => {
  const timer = setInterval(() => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % carouselItems.length);
  }, 5000);

  return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-purple-50 min-h-screen">
      {/* Hero Carousel */}
      <div className="relative h-screen">
        {carouselItems.map((item, index) => (
          <motion.div
            key={index}
            className={`absolute inset-0 flex items-center justify-center bg-purple-700 text-white ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: index === currentSlide ? 1 : 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center px-4 max-w-4xl">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">{item.title}</h1>
              <p className="text-xl md:text-2xl mb-8">{item.description}</p>
              <button onClick={onLogin} className="bg-white text-purple-700 px-8 py-3 rounded-full text-lg font-semibold hover:bg-purple-100 transition duration-300">
                {item.buttonText}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Course Groups */}
      <div className="container mx-auto py-16 px-4">
        <h2 className="text-4xl font-bold text-center mb-16 text-purple-800">Explore Our Courses</h2>
        {courseGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="mb-16">
            <h3 className="text-2xl font-semibold mb-8 text-purple-700">{group.title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {group.courses.map((course, courseIndex) => (
                <motion.div
                  key={courseIndex}
                  className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105"
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt={course.title} className="w-full h-48 object-cover" />
                  <div className="p-6">
                    <h4 className="text-xl font-semibold mb-2 text-purple-800">{course.title}</h4>
                    <p className="text-gray-600 mb-4">{course.description}</p>
                    <button className="bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition duration-300">
                      Learn More
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Testimonials */}
      <div className="bg-purple-700 text-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Success Stories</h2>
          <div className="max-w-4xl mx-auto">
            <motion.div
              key={currentTestimonialIndex}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
              className="bg-white text-gray-800 rounded-xl p-8 shadow-lg"
            >
              <p className="text-xl italic mb-4">"{testimonials[currentTestimonialIndex].message}"</p>
              <p className="font-semibold text-purple-700">{testimonials[currentTestimonialIndex].name}</p>
              <p className="text-purple-600">{testimonials[currentTestimonialIndex].course}</p>
            </motion.div>
            <div className="flex justify-center mt-8">
              <button
                className="mx-2 p-2 bg-white text-purple-700 rounded-full hover:bg-purple-100 transition duration-300"
                onClick={() => setCurrentTestimonialIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
              >
                &#8592;
              </button>
              <button
                className="mx-2 p-2 bg-white text-purple-700 rounded-full hover:bg-purple-100 transition duration-300"
                onClick={() => setCurrentTestimonialIndex((prev) => (prev + 1) % testimonials.length)}
              >
                &#8594;
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="container mx-auto py-16 px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-purple-800">Connect With Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <form className="space-y-4">
              <input type="text" placeholder="Your Name" className="w-full p-3 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
              <input type="email" placeholder="Your Email" className="w-full p-3 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
              <input type="tel" placeholder="Your Phone Number" className="w-full p-3 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
              <textarea placeholder="Your Message" rows="5" className="w-full p-3 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"></textarea>
              <button type="submit" className="bg-purple-600 text-white px-8 py-3 rounded-full hover:bg-purple-700 transition duration-300">
                Send Message
              </button>
            </form>
          </div>
          <div>
            <h3 className="text-2xl font-semibold mb-6 text-purple-700">Get in Touch</h3>
            <p className="mb-4"><i className="fas fa-map-marker-alt mr-2 text-purple-600"></i> SkillNet Campus, Innovation Drive, Tech City</p>
            <p className="mb-4"><i className="fas fa-phone mr-2 text-purple-600"></i> +1 (555) 123-4567</p>
            <p className="mb-4"><i className="fas fa-envelope mr-2 text-purple-600"></i> info@skillnet.com</p>
            <div className="mt-8">
              <h4 className="text-xl font-semibold mb-4 text-purple-700">Follow Our Journey</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-purple-600 hover:text-purple-800 transition duration-300">
                  <i className="fab fa-facebook fa-2x"></i>
                </a>
                <a href="#" className="text-purple-600 hover:text-purple-800 transition duration-300">
                  <i className="fab fa-twitter fa-2x"></i>
                </a>
                <a href="#" className="text-purple-600 hover:text-purple-800 transition duration-300">
                  <i className="fab fa-instagram fa-2x"></i>
                </a>
                <a href="#" className="text-purple-600 hover:text-purple-800 transition duration-300">
                  <i className="fab fa-linkedin fa-2x"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
