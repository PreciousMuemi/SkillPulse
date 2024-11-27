import React from 'react';
import { motion } from 'framer-motion';
import { 
  Award, 
  Star, 
  CheckCircle, 
  Zap, 
  Medal, 
  TrendingUp, 
  Layers,
  Code
} from 'lucide-react';
import Header from './Header';
// Import images
import Header1 from '../images/NFT1.jpg';
import Header2 from '../images/NFT2.jpg';
import Header3 from '../images/nft3.jpg';

const AchievementsPanel = () => {
  const achievements = [
    {
      id: 1,
      name: "Full Stack Mastery",
      icon: <Code className="w-16 h-16 mx-auto mb-2 text-blue-400" />,
      description: "Advanced Web Development Certification",
      type: 'course',
      points: 85,
      completionDate: "2024-01-15",
      headerImage: Header1
    },
    {
      id: 2,
      name: "Blockchain Foundations",
      icon: <Layers className="w-16 h-16 mx-auto mb-2 text-green-400" />,
      description: "Comprehensive Blockchain Ecosystem",
      type: 'course',
      points: 75,
      completionDate: "2024-02-20",
      headerImage: Header2
    },
    {
      id: 3,
      name: "AI & Machine Learning",
      icon: <Zap className="w-16 h-16 mx-auto mb-2 text-purple-400" />,
      description: "Advanced AI Development Bootcamp",
      type: 'course',
      points: 95,
      completionDate: "2024-03-10",
      headerImage: Header3
    }
  ];

  const getTypeStyles = (type) => {
    const typeStyles = {
      course: {
        bg: 'bg-green-900/20',
        border: 'border-green-600/30',
        text: 'text-green-300'
      },
      mentor: {
        bg: 'bg-yellow-900/20',
        border: 'border-yellow-600/30',
        text: 'text-yellow-300'
      },
      token: {
        bg: 'bg-blue-900/20',
        border: 'border-blue-600/30',
        text: 'text-blue-300'
      },
      default: {
        bg: 'bg-purple-900/20',
        border: 'border-purple-600/30',
        text: 'text-purple-300'
      }
    };

    return typeStyles[type] || typeStyles.default;
  };

  return (
    <div>

    <Header />
    <div className="bg-gradient-to-br from-[#0a0c1b] via-[#121529] to-[#1c1e33] min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto bg-[#121529] rounded-3xl shadow-2xl border border-purple-900/30 overflow-hidden"
      >
        <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 p-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Award className="text-purple-400" size={40} />
            <div>
              <h2 className="text-3xl font-bold text-white">Your Achievement Journey</h2>
              <p className="text-purple-300">Celebrate your learning milestones</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="text-green-400" />
            <span className="text-white font-semibold">
              Total Points: {achievements.reduce((sum, ach) => sum + (ach.points || 0), 0)}
            </span>
          </div>
        </div>

        <div className="p-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">
          {achievements.map((achievement, index) => {
            const typeStyle = getTypeStyles(achievement.type);
            return (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.8, rotateX: 90 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1, 
                  rotateX: 0,
                  transition: {
                    duration: 0.5,
                    delay: index * 0.2,
                    type: "spring",
                    stiffness: 150
                  }
                }}
                whileHover={{ 
                  scale: 1.05,
                  rotateX: 10,
                  rotateY: -10,
                  transition: { duration: 0.3 }
                }}
                className={`
                  ${typeStyle.bg} ${typeStyle.border}
                  rounded-3xl p-5 text-center 
                  transform transition-all duration-300
                  border
                  relative
                  overflow-hidden
                  shadow-2xl
                  perspective-1000
                  preserve-3d
                `}
              >
                {/* Header Image */}
                <div className="absolute inset-x-0 top-0 h-24 overflow-hidden">
                  <img 
                    src={achievement.headerImage} 
                    alt={achievement.name}
                    className="w-full h-full object-cover opacity-30 blur-sm"
                  />
                </div>

                <div className="relative z-10 pt-12">
                  <div className="absolute top-2 right-2 bg-white/10 rounded-full p-1">
                    <span className={`${typeStyle.text} font-bold text-xs`}>
                      {achievement.points} pts
                    </span>
                  </div>
                  
                  {achievement.icon}
                  
                  <h3 className={`font-bold text-xl text-white mb-1 ${typeStyle.text}`}>
                    {achievement.name}
                  </h3>
                  
                  <p className="text-sm text-purple-300">
                    {achievement.description}
                  </p>
                  <p className="text-xs text-purple-200 mt-1">
                    Completed on {achievement.completionDate}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
    </div>
  );
};

export default AchievementsPanel;
// import React from 'react';
// import { motion } from 'framer-motion';
// import { 
//   Award, 
//   Star, 
//   CheckCircle, 
//   Zap, 
//   Medal, 
//   TrendingUp, 
//   Layers 
// } from 'lucide-react';

// const AchievementsPanel = ({
//   achievements = [],
//   userProfile = {},
//   completedCourses = [],
//   mentorRating = 0
// }) => {
//   const generateAchievements = () => {
//     const combinedAchievements = [
//       ...achievements,
      
//       ...completedCourses.map((course, index) => ({
//         id: `course-${index}`,
//         name: `${course.title} Mastery`,
//         icon: <CheckCircle className="w-16 h-16 mx-auto mb-2 text-green-400" />,
//         description: `Completed on ${course.completionDate}`,
//         type: 'course',
//         points: course.points || 50
//       })),
      
//       ...(userProfile.isMentor ? [{
//         id: 'mentor-achievement',
//         name: 'Trusted Mentor',
//         icon: <Star className="w-16 h-16 mx-auto mb-2 text-yellow-400" />,
//         description: `Expert Rating: ${mentorRating}/5`,
//         type: 'mentor',
//         points: 100
//       }] : []),
      
//       ...(userProfile.sknTokens > 0 ? [{
//         id: 'skn-token',
//         name: 'SKN Token Pioneer',
//         icon: <Zap className="w-16 h-16 mx-auto mb-2 text-blue-400" />,
//         description: `${userProfile.sknTokens} Tokens Accumulated`,
//         type: 'token',
//         points: 75
//       }] : [])
//     ];

//     return combinedAchievements.sort((a, b) => (b.points || 0) - (a.points || 0));
//   };

//   const achievementsList = generateAchievements();

//   const getTypeStyles = (type) => {
//     const typeStyles = {
//       course: {
//         bg: 'bg-green-900/20',
//         border: 'border-green-600/30',
//         text: 'text-green-300'
//       },
//       mentor: {
//         bg: 'bg-yellow-900/20',
//         border: 'border-yellow-600/30',
//         text: 'text-yellow-300'
//       },
//       token: {
//         bg: 'bg-blue-900/20',
//         border: 'border-blue-600/30',
//         text: 'text-blue-300'
//       },
//       default: {
//         bg: 'bg-purple-900/20',
//         border: 'border-purple-600/30',
//         text: 'text-purple-300'
//       }
//     };

//     return typeStyles[type] || typeStyles.default;
//   };

//   return (
//     <div className="bg-gradient-to-br from-[#0a0c1b] via-[#121529] to-[#1c1e33] min-h-screen py-12 px-4 sm:px-6 lg:px-8">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="max-w-6xl mx-auto bg-[#121529] rounded-3xl shadow-2xl border border-purple-900/30 overflow-hidden"
//       >
//         <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 p-6 flex items-center justify-between">
//           <div className="flex items-center space-x-4">
//             <Award className="text-purple-400" size={40} />
//             <div>
//               <h2 className="text-3xl font-bold text-white">Your Achievement Journey</h2>
//               <p className="text-purple-300">Celebrate your learning milestones</p>
//             </div>
//           </div>
//           <div className="flex items-center space-x-2">
//             <TrendingUp className="text-green-400" />
//             <span className="text-white font-semibold">
//               Total Points: {achievementsList.reduce((sum, ach) => sum + (ach.points || 0), 0)}
//             </span>
//           </div>
//         </div>

//         {achievementsList.length === 0 ? (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             className="text-center py-16"
//           >
//             <Layers className="mx-auto mb-4 text-purple-400" size={48} />
//             <p className="text-xl text-purple-300">
//               Your achievement journey starts here. Keep learning and growing!
//             </p>
//             <button className="mt-6 bg-purple-600 text-white px-6 py-3 rounded-full hover:bg-purple-700 transition">
//               Explore Courses
//             </button>
//           </motion.div>
//         ) : (
//           <div className="p-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//             {achievementsList.map((achievement, index) => {
//               const typeStyle = getTypeStyles(achievement.type);
//               return (
//                 <motion.div
//                   key={achievement.id}
//                   initial={{ opacity: 0, scale: 0.8 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   transition={{
//                     duration: 0.3,
//                     delay: index * 0.1,
//                     type: "spring",
//                     stiffness: 200
//                   }}
//                   className={`
//                     ${typeStyle.bg} ${typeStyle.border}
//                     rounded-2xl p-5 text-center 
//                     transform transition-all duration-300
//                     hover:scale-105 hover:shadow-2xl
//                     border
//                     relative
//                     overflow-hidden
//                   `}
//                 >
//                   <div className="absolute top-2 right-2 bg-white/10 rounded-full p-1">
//                     <span className={`${typeStyle.text} font-bold text-xs`}>
//                       {achievement.points} pts
//                     </span>
//                   </div>
                  
//                   {typeof achievement.icon === 'string' ? (
//                     <img
//                       src={achievement.icon}
//                       alt={achievement.name}
//                       className="w-16 h-16 mx-auto mb-2 object-contain"
//                     />
//                   ) : (
//                     achievement.icon
//                   )}
                  
//                   <h3 className={`font-semibold text-white mb-1 ${typeStyle.text}`}>
//                     {achievement.name}
//                   </h3>
                  
//                   <p className="text-sm text-purple-300">
//                     {achievement.description}
//                   </p>
//                 </motion.div>
//               );
//             })}
//           </div>
//         )}
//       </motion.div>
//     </div>
//   );
// };

// export default AchievementsPanel;

