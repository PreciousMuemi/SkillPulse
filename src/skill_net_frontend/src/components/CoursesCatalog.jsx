import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const CoursesCatalog = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');

  useEffect(() => {
    axios.get('/api/courses').then(response => setCourses(response.data));
  }, []);

  const filteredCourses = courses.filter(course => 
    (!selectedCategory || course.category === selectedCategory) &&
    (!selectedDifficulty || course.difficulty === selectedDifficulty)
  );

  return (
    <div>
      <h2>Course Catalog</h2>
      <div>
        <select onChange={e => setSelectedCategory(e.target.value)}>
          <option value="">All Categories</option>
          <option value="softSkills">Soft Skills</option>
          <option value="computing">Computing</option>
          <option value="dataScience">Data Science</option>
          <option value="design">Design</option>
          <option value="business">Business</option>
          <option value="languages">Languages</option>
        </select>
        <select onChange={e => setSelectedDifficulty(e.target.value)}>
          <option value="">All Difficulties</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>
      <ul>
        {filteredCourses.map(course => (
          <li key={course._id}>
            <Link to={`/course/${course._id}`}>{course.title}</Link>
            <p>Category: {course.category}</p>
            <p>Difficulty: {course.difficulty}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CoursesCatalog;
