from flask import Flask, render_template
from allocator_engine import run_allocation, students, internships

app = Flask(__name__)

@app.route("/")
def home():
    scores, allocations, unallocated = run_allocation()

    # Restructure scores for template
    score_data = {}
    for s in students:
        score_data[s["name"]] = {}
        for i in internships:
            score_data[s["name"]][i["title"]] = scores[s["id"]][i["id"]]

    # Restructure allocations
    allocation_data = {}
    for i in internships:
        allocation_data[i["id"]] = {
            "title": i["title"],
            "students": [
                {
                    "name": next(s["name"] for s in students if s["id"] == sid),
                    "score": f"{score:.2f}"
                }
                for sid, score in allocations[i["id"]]
            ]
        }

    # Unassigned students
    unassigned_names = [s["name"] for s in unallocated]

    return render_template(
        "index.html",
        scores=score_data,
        allocation=allocation_data,
        unassigned=unassigned_names
    )


if __name__ == "__main__":
    app.run(debug=True)
