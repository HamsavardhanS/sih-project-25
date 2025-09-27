// File: InternshipFlowFull.jsx
import React, { useState } from 'react';

const students = [
  { name: 'Alice', skills: ['Python','Java'], location: 'CityA', education: 'Bachelor', GPA: 8.5, social: 'Rural' },
  { name: 'Bob', skills: ['React','SQL'], location: 'CityB', education: 'Master', GPA: 9.0, social: 'Urban' },
  { name: 'Carol', skills: ['Python','SQL'], location: 'CityC', education: 'Bachelor', GPA: 7.5, social: 'Reserved' },
];

const internships = [
  { title: 'IT Internship', requiredSkills: ['Python','SQL'], location: 'CityA', education: 'Bachelor', capacity: 1, quotaRural: 1 },
  { title: 'Marketing Internship', requiredSkills: ['React'], location: 'CityB', education: 'Bachelor', capacity: 2, quotaRural: 0 },
];

const calculateScore = (student, internship) => {
  let skillMatch = student.skills.filter(skill => internship.requiredSkills.includes(skill)).length;
  let locationScore = student.location === internship.location ? 1 : 0.2;
  let educationScore = student.education === internship.education ? 1 : 0.5;
  let socialBoost = student.social === 'Rural' && internship.quotaRural > 0 ? 0.1 : 0;
  let GPA_score = (student.GPA - 7) / 3;
  let totalScore = skillMatch*0.5 + locationScore*0.2 + educationScore*0.1 + socialBoost + GPA_score*0.2;
  return { skillMatch, locationScore, educationScore, socialBoost, GPA_score: GPA_score.toFixed(2), totalScore: totalScore.toFixed(2) };
};

const runSolver = () => {
  const results = [];
  const internshipSlots = internships.map(i => i.capacity);
  students.forEach(student => {
    let bestScore = -1;
    let bestIndex = -1;
    let calcDetails = {};
    internships.forEach((internship, idx) => {
      if(internshipSlots[idx] > 0){
        const scores = calculateScore(student, internship);
        if(scores.totalScore > bestScore){
          bestScore = scores.totalScore;
          bestIndex = idx;
          calcDetails = scores;
        }
      }
    });
    if(bestIndex !== -1){
      results.push({
        student: student.name,
        internship: internships[bestIndex].title,
        scores: calcDetails
      });
      internshipSlots[bestIndex] -= 1;
    } else {
      results.push({ student: student.name, internship: 'Not Assigned', scores: {} });
    }
  });
  return results;
};

export default function InternshipFlowFull() {
  const [matches, setMatches] = useState([]);

  return (
    <div style={{ padding: 20, fontFamily: 'Arial' }}>
      <h2>Complete Internship Matching Flow</h2>
      <p>Shows step-by-step flow: Input → ML Scoring → Solver → Final Assignment</p>
      <button onClick={() => setMatches(runSolver())} style={{ padding: '10px 20px', margin: '10px 0', cursor: 'pointer' }}>
        Run Full Flow
      </button>

      {matches.length > 0 && (
        <div style={{ marginTop: 20 }}>
          {matches.map((m, idx) => (
            <div key={idx} style={{ marginBottom: 20, padding: 10, border: '1px solid #ccc', borderRadius: 5 }}>
              <h3>{m.student} → {m.internship}</h3>
              {m.scores.totalScore ? (
                <div>
                  <p><b>ML Scoring Breakdown:</b></p>
                  <ul>
                    <li>Skill Match Score: {m.scores.skillMatch*0.5}</li>
                    <li>Location Score: {m.scores.locationScore*0.2}</li>
                    <li>Education Score: {m.scores.educationScore*0.1}</li>
                    <li>Social Boost: {m.scores.socialBoost}</li>
                    <li>GPA Score: {m.scores.GPA_score*0.2}</li>
                    <li><b>Total ML Score: {m.scores.totalScore}</b></li>
                  </ul>
                  <p><b>Solver Assignment:</b> Assigns student to the internship with highest score while respecting capacity and quotas.</p>
                </div>
              ) : (
                <p>No assignment possible.</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
