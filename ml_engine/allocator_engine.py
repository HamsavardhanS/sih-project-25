# allocater_engine.py

from score_engine import ScoreEngine

# ---------- Static Data ----------
students = [
    {"id": 1, "name": "Alice", "skills": ["Python", "ML"], "location": "Delhi", "gpa": 8.5, "is_rural": True, "reserved_category": False},
    {"id": 2, "name": "Bob", "skills": ["Java", "SQL"], "location": "Mumbai", "gpa": 7.8, "is_rural": False, "reserved_category": True},
    {"id": 3, "name": "Charlie", "skills": ["Python", "SQL"], "location": "Delhi", "gpa": 9.0, "is_rural": False, "reserved_category": False},
    {"id": 4, "name": "David", "skills": ["Java", "ML"], "location": "Bangalore", "gpa": 6.5, "is_rural": True, "reserved_category": True},
    {"id": 5, "name": "Eva", "skills": ["C++"], "location": "Chennai", "gpa": 6.0, "is_rural": False, "reserved_category": False},  # No match case
]

internships = [
    {"id": 101, "title": "AI Internship", "required_skills": ["Python", "ML"], "location": "Delhi", "slots": 2},
    {"id": 102, "title": "Backend Internship", "required_skills": ["Java", "SQL"], "location": "Mumbai", "slots": 2},
]

# ---------- Run Scoring ----------
engine = ScoreEngine(students, internships)
scores = engine.build_score_matrix()

# ---------- Print Scoreboard ----------
print("\nStudent Internship Scores:\n")
for student in students:
    print(f"{student['name']} (ID: {student['id']})")
    for internship in internships:
        score = scores[student["id"]][internship["id"]]
        print(f"  - {internship['title']}: {score:.2f}")
    print()

# ---------- Allocation Logic ----------
allocations = {internship["id"]: [] for internship in internships}

# Flatten (student, internship, score) tuples
pairs = []
for s in students:
    for i in internships:
        pairs.append((s["id"], i["id"], scores[s["id"]][i["id"]]))

# Sort by highest score first
pairs.sort(key=lambda x: x[2], reverse=True)

allocated_students = set()

for student_id, internship_id, score in pairs:
    if student_id in allocated_students:
        continue
    if len(allocations[internship_id]) < next(i["slots"] for i in internships if i["id"] == internship_id):
        allocations[internship_id].append((student_id, score))
        allocated_students.add(student_id)

# ---------- Print Allocation Results ----------
print("\nInternship Allocation Results:\n")
for internship in internships:
    print(f"{internship['title']} ({internship['slots']} slots):")
    if allocations[internship["id"]]:
        for sid, score in allocations[internship["id"]]:
            student_name = next(s["name"] for s in students if s["id"] == sid)
            print(f"  - {student_name} (Score: {score:.2f})")
    else:
        print("  - No students allocated")

# ---------- Print Unallocated Students ----------
print("\nStudents Not Allocated:\n")
unallocated = [s for s in students if s["id"] not in allocated_students]

if unallocated:
    for s in unallocated:
        print(f"- {s['name']} (ID: {s['id']})")
else:
    print("All students were allocated.")
