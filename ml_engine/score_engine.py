# score_engine.py

import numpy as np

class ScoreEngine:
    def __init__(self, students, internships):
        self.students = students
        self.internships = internships

    def calculate_score(self, student, internship):
        score = 0

        # 1. Skills match (max 40 points)
        skill_overlap = len(set(student["skills"]) & set(internship["required_skills"]))
        skill_score = (skill_overlap / max(1, len(internship["required_skills"]))) * 40
        score += skill_score

        # 2. Location preference (20 points if match)
        if student["location"] == internship["location"]:
            score += 20

        # 3. GPA / Academic performance (scaled to 20)
        gpa_score = (student["gpa"] / 10) * 20
        score += gpa_score

        # 4. Rural / Social category bonus (10 each)
        if student.get("is_rural", False):
            score += 10
        if student.get("reserved_category", False):
            score += 10

        return score

    def build_score_matrix(self):
        """Return dictionary with student-internship scores"""
        scores = {}
        for student in self.students:
            scores[student["id"]] = {}
            for internship in self.internships:
                scores[student["id"]][internship["id"]] = self.calculate_score(student, internship)
        return scores
