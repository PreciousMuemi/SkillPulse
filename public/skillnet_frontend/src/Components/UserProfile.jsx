import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, Award } from 'lucide-react';

const Card = ({ children, className }) => (
  <div className={`p-4 rounded-lg shadow-lg ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children }) => (
  <div className="mb-4">
    {children}
  </div>
);

const CardTitle = ({ children, className }) => (
  <h2 className={`text-lg font-bold ${className}`}>{children}</h2>
);

const CardContent = ({ children }) => (
  <div className="mb-4">
    {children}
  </div>
);

const CardFooter = ({ children }) => (
  <div className="mt-4">
    {children}
  </div>
);

const Button = ({ children, className, onClick }) => (
  <button onClick={onClick} className={`py-2 px-4 bg-purple-700 hover:bg-purple-600 rounded-md text-white ${className}`}>
    {children}
  </button>
);

const UserProfile = ({ user, wallet }) => (
  <Card className="bg-purple-800 text-white overflow-hidden">
    <CardHeader>
      <CardTitle className="text-2xl font-semibold">Your Profile</CardTitle>
    </CardHeader>
    <CardContent>
      <motion.div 
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-4"
      >
        <h3 className="text-xl font-medium mb-2">{user.name}</h3>
        <p className="text-purple-200">Skills: {user.skills.join(', ')}</p>
      </motion.div>
      <motion.div 
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex items-center mb-4"
      >
        <Wallet className="mr-2" size={20} />
        <p className="text-sm">{wallet.address}</p>
      </motion.div>
      <motion.div 
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex items-center"
      >
        <Award className="mr-2" size={20} />
        <p>SKN Balance: {wallet.balance.toString()}</p>
      </motion.div>
    </CardContent>
    <CardFooter>
      <Button className="w-full">Edit Profile</Button>
    </CardFooter>
  </Card>
);

export default UserProfile;
