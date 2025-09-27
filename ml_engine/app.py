from flask import Flask, render_template
from allocator_engine import run_allocation, students, internships

app = Flask(__name__)


@app.route("/")
def home():
    """Homepage with navigation buttons"""
    return render_template("home.html")

@app.route("/scores")
def scores_page():
    scores, allocations, unallocated = run_allocation()

    # Restructure scores for template
    score_data = {}
    for s in students:
        score_data[s["name"]] = {}
        for i in internships:
            score_data[s["name"]][i["title"]] = f"{scores[s['id']][i['id']]:.2f}"

    # Restructure allocations
    allocation_data = {}
    for i in internships:
        interns_list = [
            {
                "name": next(stu["name"] for stu in students if stu["id"] == sid),
                "score": f"{score:.2f}"
            }
            for sid, score in allocations[i["id"]]
        ]
        allocation_data[i["id"]] = {
            "title": i["title"],
            "students": interns_list
        }

    # Unassigned students
    unassigned_names = [s["name"] for s in unallocated]

    return render_template(
        "scores.html",
        scores=score_data,
        allocation=allocation_data,
        unassigned=unassigned_names
    )

@app.route("/allocations")
def allocations_page():
    """Page showing scores grouped by internship"""
    scores, allocations, unallocated = run_allocation()

    # Build data for each internship: include ALL students with their scores
    allocation_data = {}
    for i in internships:
        interns_list = [
            {
                "name": s["name"],
                "score": f"{scores[s['id']][i['id']]:.2f}"
            }
            for s in students
        ]
        # Sort by score (highest first)
        interns_list.sort(key=lambda x: float(x["score"]), reverse=True)

        allocation_data[i["id"]] = {
            "title": i["title"],
            "students": interns_list
        }

    return render_template("allocations.html", allocation=allocation_data)


if __name__ == "__main__":
    app.run(debug=True)
