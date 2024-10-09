import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

class MentorMatcher:
    def __init__(self):
        self.mentors = pd.DataFrame()
        self.vectorizer = TfidfVectorizer()

    def add_mentor(self, mentor_id, skills, experience):
        new_mentor = pd.DataFrame({
            'mentor_id': [mentor_id],
            'skills': [skills],
            'experience': [experience]
        })
        self.mentors = pd.concat([self.mentors, new_mentor], ignore_index=True)

    def find_match(self, mentee_skills, top_n=3):
        all_skills = self.mentors['skills'].tolist() + [mentee_skills]
        tfidf_matrix = self.vectorizer.fit_transform(all_skills)
        
        cosine_similarities = cosine_similarity(tfidf_matrix[-1], tfidf_matrix[:-1])
        similar_mentors = list(enumerate(cosine_similarities[0]))
        similar_mentors = sorted(similar_mentors, key=lambda x: x[1], reverse=True)
        
        top_matches = similar_mentors[:top_n]
        return [(self.mentors.iloc[i]['mentor_id'], score) for i, score in top_matches]

# Usage
matcher = MentorMatcher()
matcher.add_mentor(1, "Python, Machine Learning, Data Analysis", "5 years")
matcher.add_mentor(2, "JavaScript, React, Web Development", "3 years")
matcher.add_mentor(3, "Agribusiness, Farm Management, Sustainable Agriculture", "7 years")

matches = matcher.find_match("Python, Data Analysis, Statistics")
print(matches)