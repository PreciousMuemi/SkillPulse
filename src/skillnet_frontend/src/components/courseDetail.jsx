import React, { useState, useEffect } from 'react';
import { getUser } from '../services/api';
import { useAuth } from './AuthContext';

function UserProfile() {
  const [user, setUser] = useState(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    async function fetchUser() {
      if (isAuthenticated) {
        const userData = await getUser();
        setUser(userData);
      }
    }
    fetchUser();
  }, [isAuthenticated]);

  if (!isAuthenticated) return <div>Please log in to view your profile.</div>;
  if (!user) return <div>Loading...</div>;

  return (
    <div className="user-profile">
      <h2>{user.username}'s Profile</h2>
      <p>Level: {user.level}</p>
      <p>Rank: {user.rank}</p>
      <p>Tokens: {user.tokens}</p>
      <h3>Skills</h3>
      <ul>
        {user.skills.map((skill, index) => (
          <li key={index}>{skill}</li>
        ))}
      </ul>
      <h3>Completed Courses</h3>
      <ul>
        {user.completedCourses.map((courseId) => (
          <li key={courseId}>Course ID: {courseId}</li>
        ))}
      </ul>
    </div>
  );
}

export default UserProfile;