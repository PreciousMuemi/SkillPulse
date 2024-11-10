import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Mock data - replace with actual data in a real implementation
courses = {
    "course1": {"title": "Introduction to Programming", "description": "Learn basics of programming", "skills": ["python", "algorithms"]},
    "course2": {"title": "Web Development", "description": "Build modern web applications", "skills": ["html", "css", "javascript"]},
    "course3": {"title": "Data Science Fundamentals", "description": "Explore data analysis and machine learning", "skills": ["python", "statistics", "machine learning"]},
}

users = {
    "user1": {"skills": ["python", "html"], "completed_courses": ["course1"]},
    "user2": {"skills": ["javascript", "css"], "completed_courses": ["course2"]},
}

mentors = {
    "mentor1": {"skills": ["python", "machine learning", "data science"]},
    "mentor2": {"skills": ["javascript", "react", "node.js"]},
}

# Helper functions
def calculate_similarity(vec1, vec2):
    return cosine_similarity(vec1, vec2)[0][0]

@app.route('/recommend_courses', methods=['POST'])
def recommend_courses():
    data = request.json
    user_id = data['user_id']
    user_skills = users[user_id]['skills']
    completed_courses = users[user_id]['completed_courses']
    
    # Create a TF-IDF vectorizer
    vectorizer = TfidfVectorizer()
    
    # Prepare course descriptions
    course_descriptions = [courses[c]['description'] for c in courses if c not in completed_courses]
    course_ids = [c for c in courses if c not in completed_courses]
    
    # Fit and transform course descriptions
    course_vectors = vectorizer.fit_transform(course_descriptions)
    
    # Transform user skills
    user_vector = vectorizer.transform([' '.join(user_skills)])
    
    # Calculate similarities
    similarities = cosine_similarity(user_vector, course_vectors)[0]
    
    # Sort courses by similarity
    recommended_courses = [course_ids[i] for i in similarities.argsort()[::-1]]
    
    return jsonify({
        'recommended_courses': recommended_courses[:3],
        'confidence': float(np.mean(similarities))
    })

@app.route('/assess_course', methods=['POST'])
def assess_course():
    data = request.json
    user_id = data['user_id']
    course_id = data['course_id']
    answers = data['answers']
    
    # This is a placeholder. In a real implementation, you would compare
    # the answers to the correct answers and calculate a score.
    score = np.random.uniform(0.6, 1.0)
    
    feedback = "Good job! You've shown a solid understanding of the course material."
    next_steps = ["Review chapter 5", "Practice more on topic X"]
    
    return jsonify({
        'score': float(score),
        'feedback': feedback,
        'next_steps': next_steps
    })

@app.route('/user_mentor_status', methods=['GET'])
def get_user_mentor_status():
    # In a real implementation, you would get the user ID from the session
    user_id = request.args.get('user_id')
    
    is_mentor = user_id in mentors
    has_mentor = False  # You would check your database for this
    
    return jsonify({
        'is_mentor': is_mentor,
        'has_mentor': has_mentor
    })

# Update the match_mentor route to handle the frontend requests
@app.route('/match_mentor', methods=['POST'])
def match_mentor():
    data = request.json
    mentee_id = data['mentee_id']
    desired_skills = data['desired_skills']
    
    # Your existing matching logic here
    vectorizer = TfidfVectorizer()
    mentor_skills = [' '.join(mentors[m]['skills']) for m in mentors]
    mentor_vectors = vectorizer.fit_transform(mentor_skills)
    
    mentee_vector = vectorizer.transform([' '.join(desired_skills)])
    
    similarities = cosine_similarity(mentee_vector, mentor_vectors)[0]
    
    sorted_mentors = sorted(zip(mentors.keys(), similarities), 
                          key=lambda x: x[1], 
                          reverse=True)
    
    return jsonify({
        'recommended_mentors': [m[0] for m in sorted_mentors[:3]],
        'match_scores': [float(m[1]) for m in sorted_mentors[:3]]
    })
if __name__ == '__main__':
    app.run(debug=True)