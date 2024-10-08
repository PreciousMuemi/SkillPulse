// import React from 'react';
// import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
// import UserProfile from './Components/UserProfile';
// // import CourseList from './components/CourseList';
// // import MentorshipPanel from './components/MentorshipPanel';
// // import JobMarketplace from './components/JobMarketplace';
// // import LoginPage from './Components/LoginForm';

// const pageVariants = {
//   initial: { opacity: 0, x: "-100vw" },
//   in: { opacity: 1, x: 0 },
//   out: { opacity: 0, x: "100vw" }
// };

// const pageTransition = {
//   type: "tween",
//   ease: "anticipate",
//   duration: 0.5
// };

// const App = () => {
//   return (
//     <Router>
//       <div className="app bg-gradient-to-br from-purple-900 via-purple-700 to-purple-500 min-h-screen text-white">
//         <nav className="p-4">
//           <ul className="flex justify-center space-x-4">
//             <li><Link to="/" className="hover:text-purple-200 transition-colors">Home</Link></li>
//             <li><Link to="/profile" className="hover:text-purple-200 transition-colors">Profile</Link></li>
//             <li><Link to="/courses" className="hover:text-purple-200 transition-colors">Courses</Link></li>
//             <li><Link to="/mentorship" className="hover:text-purple-200 transition-colors">Mentorship</Link></li>
//             <li><Link to="/jobs" className="hover:text-purple-200 transition-colors">Jobs</Link></li>
//           </ul>
//         </nav>

//         <AnimatePresence exitBeforeEnter>
//           <Routes>
//             <Route path="/" element={
//               <motion.div
//                 initial="initial"
//                 animate="in"
//                 exit="out"
//                 variants={pageVariants}
//                 transition={pageTransition}
//               >
//                 <LoginPage />
//               </motion.div>
//             } />
//             <Route path="/profile" element={
//               <motion.div
//                 initial="initial"
//                 animate="in"
//                 exit="out"
//                 variants={pageVariants}
//                 transition={pageTransition}
//               >
//                 <UserProfile user={{name: 'John Doe', skills: ['React', 'Blockchain']}} wallet={{address: '0x123...', balance: '100 SKN'}} />
//               </motion.div>
//             } />
//             <Route path="/courses" element={
//               <motion.div
//                 initial="initial"
//                 animate="in"
//                 exit="out"
//                 variants={pageVariants}
//                 transition={pageTransition}
//               >
//                 <CourseList courses={[{id: 1, title: 'React Basics', description: 'Learn React fundamentals', progress: 50}]} onEnroll={() => {}} />
//               </motion.div>
//             } />
//             <Route path="/mentorship" element={
//               <motion.div
//                 initial="initial"
//                 animate="in"
//                 exit="out"
//                 variants={pageVariants}
//                 transition={pageTransition}
//               >
//                 <MentorshipPanel mentors={[{id: 1, name: 'Jane Doe', expertise: 'React'}]} onRequestMentor={() => {}} />
//               </motion.div>
//             } />
//             <Route path="/jobs" element={
//               <motion.div
//                 initial="initial"
//                 animate="in"
//                 exit="out"
//                 variants={pageVariants}
//                 transition={pageTransition}
//               >
//                 <JobMarketplace />
//               </motion.div>
//             } />
//           </Routes>
//         </AnimatePresence>
//       </div>
//     </Router>
//   );
// };

// export default App;

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './Components/landingPage';
import UserProfile from './Components/UserProfile';

const App = () => {

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/profile" element={<UserProfile />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;