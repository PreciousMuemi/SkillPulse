import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from flask import Flask, request, jsonify
from flask_cors import CORS
from functools import lru_cache
import time

app = Flask(__name__)
CORS(app)

# Enhanced data structures with proficiency levels and weights
PROFICIENCY_LEVELS = {
    "beginner": 1,
    "intermediate": 2,
    "expert": 3
}

SKILL_WEIGHTS = {
    "python": 1.2,
    "machine_learning": 1.5,
    "javascript": 1.1,
    "data_science": 1.4,
    "web_development": 1.2
}

# Enhanced mock data
courses = {
    "course1": {
        "title": "Introduction to Programming",
        "description": "Learn basics of programming",
        "skills": [{"name": "python", "level": "beginner"}, {"name": "algorithms", "level": "beginner"}],
        "difficulty": 1
    },
    "course2": {
        "title": "Web Development",
        "description": "Build modern web applications",
        "skills": [{"name": "html", "level": "intermediate"}, {"name": "css", "level": "intermediate"}, {"name": "javascript", "level": "intermediate"}],
        "difficulty": 2
    }
}

users = {
    "user1": {
        "skills": [{"name": "python", "level": "beginner"}, {"name": "html", "level": "intermediate"}],
        "completed_courses": ["course1"],
        "timezone": "UTC-5",
        "learning_style": "visual"
    }
}

mentors = {
    "mentor1": {
        "skills": [{"name": "python", "level": "expert"}, {"name": "machine_learning", "level": "expert"}],
        "experience_years": 5,
        "rating": 4.8,
        "availability": ["Monday", "Wednesday"],
        "timezone": "UTC-5",
        "industry": "tech",
        "successful_mentorships": 12
    }
}

# Enhanced helper functions
def validate_skills(skills):
    return all(skill["name"] in SKILL_WEIGHTS and skill["level"] in PROFICIENCY_LEVELS for skill in skills)

@lru_cache(maxsize=128)
def calculate_enhanced_similarity(mentor_skills_text, mentee_skills_text, mentor_experience, mentor_rating):
    vectorizer = TfidfVectorizer()
    mentor_vector = vectorizer.fit_transform([mentor_skills_text])
    mentee_vector = vectorizer.transform([mentee_skills_text])
    base_similarity = cosine_similarity(mentor_vector, mentee_vector)[0][0]
    experience_weight = np.log1p(mentor_experience)
    rating_weight = mentor_rating / 5.0
    return base_similarity * experience_weight * rating_weight

def get_weighted_skills(skills):
    weighted_skills = []
    for skill in skills:
        weight = SKILL_WEIGHTS.get(skill["name"], 1.0)
        level_weight = PROFICIENCY_LEVELS[skill["level"]]
        weighted_skills.append(f"{skill['name']} {weight * level_weight}")
    return " ".join(weighted_skills)

@app.route('/recommend_courses', methods=['POST'])
def recommend_courses():
    data = request.json
    if not data or 'user_id' not in data:
        return jsonify({"error": "Invalid request data"}), 400
    
    user_id = data['user_id']
    user = users.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    vectorizer = TfidfVectorizer()
    user_skills_text = get_weighted_skills(user["skills"])
    available_courses = [c for c in courses.items() if c[0] not in user["completed_courses"]]
    
    if not available_courses:
        return jsonify({"message": "No new courses available"}), 200

    course_descriptions = [c[1]["description"] for c in available_courses]
    course_vectors = vectorizer.fit_transform(course_descriptions)
    user_vector = vectorizer.transform([user_skills_text])
    
    similarities = cosine_similarity(user_vector, course_vectors)[0]
    recommended_courses = [
        {
            "course_id": available_courses[i][0],
            "similarity": float(similarities[i]),
            "difficulty": available_courses[i][1]["difficulty"]
        }
        for i in range(len(similarities))
    ]
    
    recommended_courses.sort(key=lambda x: (x["similarity"], -x["difficulty"]), reverse=True)
    
    return jsonify({
        "recommended_courses": recommended_courses[:3],
        "confidence": float(np.mean([c["similarity"] for c in recommended_courses[:3]]))
    })

@app.route('/match_mentor', methods=['POST'])
def match_mentor():
    data = request.json
    if not data or 'mentee_id' not in data or 'desired_skills' not in data:
        return jsonify({"error": "Invalid request data"}), 400
    
    mentee_id = data['mentee_id']
    desired_skills = data['desired_skills']
    
    if not validate_skills(desired_skills):
        return jsonify({"error": "Invalid skills data"}), 400
    
    mentee_skills_text = get_weighted_skills(desired_skills)
    
    mentor_matches = []
    for mentor_id, mentor_data in mentors.items():
        mentor_skills_text = get_weighted_skills(mentor_data["skills"])
        
        similarity = calculate_enhanced_similarity(
            mentor_skills_text,
            mentee_skills_text,
            mentor_data["experience_years"],
            mentor_data["rating"]
        )
        
        mentor_matches.append({
            "mentor_id": mentor_id,
            "similarity": float(similarity),
            "experience_years": mentor_data["experience_years"],
            "rating": mentor_data["rating"],
            "availability": mentor_data["availability"],
            "timezone": mentor_data["timezone"]
        })
    
    mentor_matches.sort(key=lambda x: x["similarity"], reverse=True)
    
    return jsonify({
        "recommended_mentors": mentor_matches[:3],
        "match_confidence": float(np.mean([m["similarity"] for m in mentor_matches[:3]]))
    })


if __name__ == '__main__':
    app.run(debug=True)
