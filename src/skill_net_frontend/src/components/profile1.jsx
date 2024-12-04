// import React, { useState, useEffect, useCallback } from 'react';
// import { motion } from 'framer-motion';
// import { Camera, Edit, User, Award, Book, Badge, X, Check, Plus } from 'lucide-react';

// // Dummy images (replace with actual paths)
// import BACKGROUND_IMAGE from '../images/bg.jpg';
// import BADGE_IMAGE from '../images/badge1.jpg';
// import BADGE_IMAGE2 from '../images/badge2.jpg';
// import DEFAULT_PROFILE_PIC from '../images/bg.jpg';

// const UserProfile = () => {
//   const [profile, setProfile] = useState({
// @@ -23,55 +23,76 @@ const UserProfile = () => {
//   const [badges, setBadges] = useState([]);
//   const [isEditing, setIsEditing] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
  
//   // New state for editing skills and courses
//   const [newSkill, setNewSkill] = useState('');
//   const [newCourse, setNewCourse] = useState({
//     title: '',
//     completionDate: ''
//   });

//   useEffect(() => {
//     // Simulated data fetching
//     const fetchProfileData = async () => {
//       try {
//         setIsLoading(true);
//         // In a real app, this would be an API call
//         const initialProfile = {
//           username: 'skillmaster2024',
//           principal: 'x7h3d-dkf90-...',
//           xp: 1250,
//           skills: ['React', 'Blockchain', 'UI/UX'],
//           bio: 'Passionate about technology and continuous learning.',
//           isMentor: true,
//           profilePic: DEFAULT_PROFILE_PIC
//         };

//         const courses = [
//           { 
//             id: 1, 
//             title: 'Advanced React Development', 
//             completionDate: '2024-01-15' 
//           },
//           { 
//             id: 2, 
//             title: 'Blockchain Fundamentals', 
//             completionDate: '2024-02-20' 
//           }
//         ];

//         const earnedBadges = [
//           { 
//             id: 1, 
//             name: 'Blockchain Pioneer', 
//             image: BADGE_IMAGE 
//           },
//           { 
//             id: 2, 
//             name: 'React Master', 
//             image: BADGE_IMAGE2
//           }
//         ];
//         setProfile(initialProfile);
//         setCompletedCourses(courses);
//         setBadges(earnedBadges);
//       } catch (error) {
//         console.error('Failed to fetch profile data', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchProfileData();
//   }, []);
//   // Enhanced profile update methods
//   const handleProfileUpdate = useCallback((field, value) => {
//     setProfile(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   }, []);

//   const handleProfilePicUpload = (e) => {
//     const file = e.target.files[0];
// @@ -83,20 +104,72 @@ const UserProfile = () => {
//       reader.readAsDataURL(file);
//     }
//   };
//   // New skill management methods
//   const addSkill = () => {
//     if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
//       setProfile(prev => ({
//         ...prev,
//         skills: [...prev.skills, newSkill.trim()]
//       }));
//       setNewSkill('');
//     }
//   };
//   const removeSkill = (skillToRemove) => {
//     setProfile(prev => ({
//       ...prev,
//       skills: prev.skills.filter(skill => skill !== skillToRemove)
//     }));
//   };
//   // New course management methods
//   const addCourse = () => {
//     if (newCourse.title.trim() && newCourse.completionDate) {
//       const courseToAdd = {
//         id: Date.now(),
//         title: newCourse.title.trim(),
//         completionDate: newCourse.completionDate
//       };
//       setCompletedCourses(prev => [...prev, courseToAdd]);
//       setNewCourse({ title: '', completionDate: '' });
//     }
//   };
//   const removeCourse = (courseId) => {
//     setCompletedCourses(prev => 
//       prev.filter(course => course.id !== courseId)
//     );
//   };
//   // Render loading state
//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-blue-800 flex items-center justify-center">
//         <div className="animate-pulse text-white text-2xl">
//           Loading Profile...
//         </div>
//       </div>
//     );
//   }
//   return (
//     <div className="fixed inset-0 bg-cover bg-center bg-no-repeat" 
//       style={{ 
//         backgroundImage: `url(${BACKGROUND_IMAGE})`, 
//         backgroundAttachment: 'fixed',
//         backgroundSize: 'cover'
//       }}
//     >
//       <div className="absolute inset-0 bg-black/40 backdrop-blur-lg overflow-y-auto">
//         <div className="container mx-auto px-4 py-12 relative max-w-6xl">
//           <motion.div 
//             initial={{ opacity: 0, y: 50 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8, ease: "easeOut" }}
//             className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8 relative hover:bg-white/15 transition-all duration-300"
//           >
//             {/* Profile Header - Similar to previous implementation */}
//             <div className="flex items-center mb-8">
//               <div className="relative group">
//                 <motion.img 
// @@ -120,13 +193,14 @@ const UserProfile = () => {
//                 </label>
//               </div>

//               <div className="ml-6 flex-grow">
//                 {isEditing ? (
//                   <input 
//                     type="text"
//                     value={profile.username}
//                     onChange={(e) => handleProfileUpdate('username', e.target.value)}
//                     className="text-2xl font-bold text-white bg-white/10 rounded-lg px-2 py-1 w-full"
//                     placeholder="Enter username"
//                   />
//                 ) : (
//                   <h1 className="text-2xl font-bold text-white">{profile.username}</h1>
// @@ -147,11 +221,11 @@ const UserProfile = () => {
//                 onClick={() => setIsEditing(!isEditing)}
//                 className="ml-auto bg-white/20 hover:bg-white/30 text-white p-2 rounded-full"
//               >
//                 {isEditing ? <X size={20} /> : <Edit size={20} />}
//               </button>
//             </div>

//             {/* Profile Details - Enhanced with more interactive editing */}
//             <div className="grid md:grid-cols-3 gap-6">
//               {/* Personal Info */}
//               <motion.div 
// @@ -170,38 +244,62 @@ const UserProfile = () => {
//                     onChange={(e) => handleProfileUpdate('bio', e.target.value)}
//                     className="w-full bg-white/10 text-white rounded-lg p-2"
//                     rows={4}
//                     placeholder="Tell us about yourself..."
//                   />
//                 ) : (
//                   <p className="text-white/80">{profile.bio}</p>
//                 )}
//               </motion.div>
//               {/* Skills - Enhanced with add/remove functionality */}
//               <motion.div
//                 initial={{ opacity: 0, x: -50 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ duration: 0.8 }}
//                 whileHover={{ scale: 1.02 }}
//                 className="bg-white/10 rounded-xl p-6"
//               >
//                 <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
//                   <Award className="mr-2 text-white/70" />
//                   Skills
//                 </h3>
//                 <div className="flex flex-wrap gap-2 mb-4">
//                   {profile.skills.map((skill, index) => (
//                     <motion.span 
//                       key={index}
//                       initial={{ opacity: 0, scale: 0.8 }}
//                       animate={{ opacity: 1, scale: 1 }}
//                       className="bg-white/20 text-white px-3 py-1 rounded-full text-sm flex items-center"
//                     >
//                       {skill}
//                       {isEditing && (
//                         <button 
//                           onClick={() => removeSkill(skill)} 
//                           className="ml-2 hover:text-red-400"
//                         >
//                           <X size={12} />
//                         </button>
//                       )}
//                     </motion.span>
//                   ))}
//                 </div>
//                 {isEditing && (
//                   <div className="flex">
//                     <input 
//                       type="text"
//                       value={newSkill}
//                       onChange={(e) => setNewSkill(e.target.value)}
//                       className="flex-grow bg-white/10 text-white rounded-l-lg px-2 py-1"
//                       placeholder="Add a skill"
//                     />
//                     <button 
//                       onClick={addSkill}
//                       className="bg-white/20 text-white px-3 py-1 rounded-r-lg hover:bg-white/30"
//                     >
//                       <Plus size={16} />
//                     </button>
//                   </div>
//                 )}
//               </motion.div>

//               {/* Experience */}
// @@ -222,7 +320,7 @@ const UserProfile = () => {
//             {/* Achievements */}
//             <div className="mt-8">
//               <div className="grid md:grid-cols-2 gap-6">
//                 {/* Completed Courses - Enhanced with add/remove functionality */}
//                 <motion.div 
//                   initial={{ opacity: 0, y: 50 }}
//                   animate={{ opacity: 1, y: 0 }}
// @@ -236,14 +334,47 @@ const UserProfile = () => {
//                     <motion.div 
//                       key={course.id}
//                       whileHover={{ scale: 1.05 }}
//                       className="bg-white/20 rounded-lg p-4 mb-2 flex justify-between items-center"
//                     >
//                       <div>
//                         <h4 className="text-white font-medium">{course.title}</h4>
//                         <p className="text-white/70 text-sm">
//                           Completed: {course.completionDate}
//                         </p>
//                       </div>
//                       {isEditing && (
//                         <button 
//                           onClick={() => removeCourse(course.id)} 
//                           className="text-white hover:text-red-400"
//                         >
//                           <X size={16} />
//                         </button>
//                       )}
//                     </motion.div>
//                   ))}
//                   {isEditing && (
//                     <div className="mt-4 space-y-2">
//                       <input 
//                         type="text"
//                         value={newCourse.title}
//                         onChange={(e) => setNewCourse(prev => ({...prev, title: e.target.value}))}
//                         className="w-full bg-white/10 text-white rounded-lg px-2 py-1"
//                         placeholder="Course Title"
//                       />
//                       <input 
//                         type="date"
//                         value={newCourse.completionDate}
//                         onChange={(e) => setNewCourse(prev => ({...prev, completionDate: e.target.value}))}
//                         className="w-full bg-white/10 text-white rounded-lg px-2 py-1"
//                       />
//                       <button 
//                         onClick={addCourse}
//                         className="w-full bg-white/20 text-white py-1 rounded-lg hover:bg-white/30 flex items-center justify-center"
//                       >
//                         <Plus size={16} className="mr-2" /> Add Course
//                       </button>
//                     </div>
//                   )}
//                 </motion.div>

//                 {/* Badges */}
// @@ -260,7 +391,7 @@ const UserProfile = () => {
//                     {badges.map((badge) => (
//                       <motion.div 
//                         key={badge.id}
//                         whileHover={{ rotaterotate: 5, scale: 1.1 }}
//                         className="text-center"
//                       >
//                         <img 
// @@ -275,6 +406,28 @@ const UserProfile = () => {
//                 </motion.div>
//               </div>
//             </div>
//             {/* Save/Cancel buttons for editing */}
//             {isEditing && (
//               <div className="mt-6 flex justify-end space-x-4">
//                 <button
//                   onClick={() => setIsEditing(false)}
//                   className="bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 flex items-center"
//                 >
//                   <X size={16} className="mr-2" /> Cancel
//                 </button>
//                 <button
//                   onClick={() => {
//                     // Here you would typically save to backend
//                     console.log('Saving profile', profile);
//                     setIsEditing(false);
//                   }}
//                   className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center"
//                 >
//                   <Check size={16} className="mr-2" /> Save Changes
//                 </button>
//               </div>
//             )}
//           </motion.div>
//         </div>
//       </div>
