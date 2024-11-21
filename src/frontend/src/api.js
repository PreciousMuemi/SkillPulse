// Add API client for mentor matching
export async function matchMentor(menteeId, desiredSkills) {
  const response = await fetch('http://127.0.0.1:5000/match_mentor', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      mentee_id: menteeId,
      desired_skills: desiredSkills
    })
  });
  return response.json();
}
