import os
import csv
from collections import defaultdict
from datetime import date
import calendar

from fastapi import FastAPI, Request, Form
from constants import EXERCISES
from fastapi.responses import RedirectResponse
from fastapi.templating import Jinja2Templates
from typing import List, Optional

app = FastAPI()
templates = Jinja2Templates(directory="templates")

TEMPLATE_HEADERS = ["workout_name", "category", "exercise", "load_type", "load", "band_level", "reps", "sets", "rest_sec", "duration_sec"]
COMPLETED_HEADERS = ["date", "workout_name", "exercise", "load_type", "load", "band_level", "reps", "sets", "rpe", "rest_sec", "duration_sec"]

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

TEMPLATES_FILE = os.path.join(BASE_DIR, "workout_templates.csv")
COMPLETED_FILE = os.path.join(BASE_DIR, "completed_sets.csv")

# Ensure template file exists with headers
if not os.path.exists(TEMPLATES_FILE) or os.path.getsize(TEMPLATES_FILE) == 0:
    with open(TEMPLATES_FILE, "w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=TEMPLATE_HEADERS)
        writer.writeheader()

# Ensure completed file exists with headers
if not os.path.exists(COMPLETED_FILE) or os.path.getsize(COMPLETED_FILE) == 0:
    with open(COMPLETED_FILE, "w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=COMPLETED_HEADERS)
        writer.writeheader()


# map internal exercise key -> friendly label
EXERCISE_LABELS = {key: ex["label"] for key, ex in EXERCISES.items()}

# map category -> friendly label (just capitalized for now)
CATEGORY_LABELS = {cat: cat.capitalize() for cat in set(e["category"] for e in EXERCISES.values())}


def get_category_for_exercise(exercise_key: str) -> str:
    ex = EXERCISES.get(exercise_key)
    if ex:
        return ex["category"]
    return "unknown"

# --------- Routes ---------
@app.get("/")
def home(request: Request):
    return templates.TemplateResponse(
        "choose_template.html",
        {
            "request": request,
            "templates": get_template_names(),
        },
    )


@app.post("/save_workout/")
def save_workout(
    workout_name: str = Form(...),
    category: List[str] = Form(...),
    exercise: List[str] = Form(...),
    load_type: List[str] = Form(...),
    load: Optional[List[str]] = Form(None),         # <-- string for initial parsing
    band_level: Optional[List[str]] = Form(None),   # <-- string for initial parsing
    reps: List[int] = Form(...),
    sets: List[int] = Form(...),
    rest_sec: List[int] = Form(...),
    duration_sec: Optional[List[str]] = Form(None)  # <-- string for initial parsing
):
    n = len(exercise)

    # Convert strings to float/int safely
    load = [float(x) if x else None for x in (load or [])]
    if len(load) < n:
        load.extend([None] * (n - len(load)))

    band_level = band_level or []
    band_level.extend("" * (n - len(band_level)))

    duration_sec = [int(x) if x else None for x in (duration_sec or [])]
    if len(duration_sec) < n:
        duration_sec.extend([None] * (n - len(duration_sec)))


    file_exists = os.path.exists(TEMPLATES_FILE)
    with open(TEMPLATES_FILE, "a", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=TEMPLATE_HEADERS)
        if not file_exists or os.path.getsize(TEMPLATES_FILE) == 0:
            writer.writeheader()
        for i in range(n):
            writer.writerow({
                "workout_name": workout_name,
                "category": category[i],
                "exercise": exercise[i],
                "load_type": load_type[i],
                "load": load[i] if load[i] is not None else "",
                "band_level": band_level[i] if band_level[i] else "",
                "reps": reps[i],
                "sets": sets[i],
                "rest_sec": rest_sec[i],
                "duration_sec": duration_sec[i] if duration_sec[i] is not None else ""
            })

    return RedirectResponse("/", status_code=303)


# Utility to get list of saved templates
def get_template_names():
    names = set()
    try:
        with open(TEMPLATES_FILE, newline='') as f:
            reader = csv.DictReader(f)
            for row in reader:
                names.add(row["workout_name"])
    except FileNotFoundError:
        pass
    return list(names)

@app.get("/execute")
def choose_template(request: Request):
    return templates.TemplateResponse("choose_template.html", {
        "request": request,
        "templates": get_template_names()
    })

@app.get("/load_template/{workout_name}")
def load_template(request: Request, workout_name: str):
    data = []
    with open(TEMPLATES_FILE, newline='') as f:
        reader = csv.DictReader(f)
        for row in reader:
            if row["workout_name"] == workout_name:
                data.append(row)

    return templates.TemplateResponse("execute.html", {
        "request": request,
        "workout_name": workout_name,
        "workout_data": data,
        "exercise_labels": EXERCISE_LABELS,
        "category_labels": CATEGORY_LABELS,
        "EXERCISES": EXERCISES
    })


@app.post("/save_completed_workout/")
def save_completed_workout(
    workout_name: str = Form(...),
    exercise: List[str] = Form(...),
    load_type: List[str] = Form(...),
    load: Optional[List[str]] = Form(None),
    band_level: Optional[List[str]] = Form(None),
    reps: List[int] = Form(...),
    sets: List[int] = Form(...),
    rpe: List[str] = Form(...),
    rest_sec: List[int] = Form(...),
    duration_sec: Optional[List[str]] = Form(None)
):
    rpe = [float(x) if x != "" else None for x in rpe]
    with open(COMPLETED_FILE, "a", newline="") as f:
        writer = csv.writer(f)
        n = len(exercise)

        # Convert strings to float/int safely
        load = [float(x) if x else None for x in (load or [])]
        if len(load) < n:
            load.extend([None] * (n - len(load)))

        band_level = band_level or []
        band_level.extend("" * (n - len(band_level)))

        duration_sec = [int(x) if x else None for x in (duration_sec or [])]
        if len(duration_sec) < n:
            duration_sec.extend([None] * (n - len(duration_sec)))

        for i in range(n):
            writer.writerow([
                date.today().isoformat(),
                workout_name,
                exercise[i],
                load_type[i],
                load[i] if load[i] is not None else "",
                reps[i],
                sets[i],
                rpe[i] if rpe[i] is not None else "",
                rest_sec[i],
                duration_sec[i] if duration_sec[i] is not None else ""
            ])
    return RedirectResponse("/", status_code=303)

@app.get("/edit_workout/{workout_name}")
def edit_workout(request: Request, workout_name: str):
    rows = []
    with open(TEMPLATES_FILE, newline="") as f:
        reader = csv.DictReader(f)
        for row in reader:
            if row["workout_name"] == workout_name:
                rows.append(row)

    # categories: keys grouped by category
    categories = {cat: [ex for ex in EXERCISES if EXERCISES[ex]["category"]==cat]
                  for cat in set(e["category"] for e in EXERCISES.values())}

    # map internal exercise key -> friendly label
    exercise_labels = {key: ex["label"] for key, ex in EXERCISES.items()}

    # map category -> friendly label (can be just capitalized)
    category_labels = {cat: cat.capitalize() for cat in categories.keys()}

    return templates.TemplateResponse("edit_workout.html", {
        "request": request,
        "workout_name": workout_name,
        "rows": rows,
        "categories": categories,
        "exercise_labels": exercise_labels,
        "category_labels": category_labels
    })

@app.post("/update_workout/")
def update_workout(
    workout_name: str = Form(...),
    exercise: List[str] = Form(...),
    load: Optional[List[str]] = Form(None),
    load_type: List[str] = Form(None),
    band_level: Optional[List[str]] = Form(None),
    reps: List[int] = Form(...),
    sets: List[int] = Form(...),
    rest_sec: List[int] = Form(...),
    duration_sec: Optional[List[str]] = Form(None)
):
    updated_rows = []

    # Load all existing templates
    with open(TEMPLATES_FILE, newline="") as f:
        reader = csv.DictReader(f)
        for row in reader:
            if row["workout_name"] != workout_name:
                updated_rows.append(row)

    n = len(exercise)

    # Convert strings to float/int safely
    load = [float(x) if x else None for x in (load or [])]
    if len(load) < n:
        load.extend([None] * (n - len(load)))

    band_level = band_level or []
    band_level.extend("" * (n - len(band_level)))

    duration_sec = [int(x) if x else None for x in (duration_sec or [])]
    if len(duration_sec) < n:
        duration_sec.extend([None] * (n - len(duration_sec)))


    # Add updated workout rows
    for i in range(n):
        category = get_category_for_exercise(exercise[i])

        updated_rows.append({
            "workout_name": workout_name.strip(),
            "category": category,
            "exercise": exercise[i],
            "load_type": load_type[i],
            "load": load[i] if load[i] is not None else "",
            "reps": reps[i],
            "sets": sets[i],
            "rest_sec": rest_sec[i],
            "duration_sec": duration_sec[i] if duration_sec[i] is not None else ""
        })

    # Rewrite file
    with open(TEMPLATES_FILE, "w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=updated_rows[0].keys())
        writer.writeheader()
        writer.writerows(updated_rows)

    return RedirectResponse("/execute", status_code=303)

@app.get("/builder")
def builder(request: Request):
    # categories grouped by category key
    categories = {cat: [ex for ex in EXERCISES if EXERCISES[ex]["category"]==cat]
                  for cat in CATEGORY_LABELS.keys()}

    return templates.TemplateResponse(
        "log.html",
        {
            "request": request,
            "categories": categories,
            "category_labels": CATEGORY_LABELS,
            "exercise_labels": EXERCISE_LABELS,
            "EXERCISES": EXERCISES
        },
    )

@app.get("/delete_workout/{workout_name}")
def delete_workout(workout_name: str):
    # Read all templates
    rows = []
    with open(TEMPLATES_FILE, newline="") as f:
        reader = csv.DictReader(f)
        for row in reader:
            if row["workout_name"] != workout_name:
                rows.append(row)

    # Write back all rows except the deleted one
    with open(TEMPLATES_FILE, "w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=[
            "workout_name", "category", "exercise", "load", "reps", "sets", "rest_sec", "duration_sec"
        ])
        writer.writeheader()
        writer.writerows(rows)

    # Make sure to use status_code=303 (See Other)
    return RedirectResponse("/", status_code=303)


@app.get("/completed_workouts")
def completed_workouts(request: Request):
    # Structure: {year: {month: {day: [rows]}}}
    workouts_by_date = defaultdict(lambda: defaultdict(lambda: defaultdict(list)))

    try:
        with open(COMPLETED_FILE, newline='') as f:
            reader = csv.DictReader(f)
            for row in reader:
                dt = date.fromisoformat(row["date"])
                workouts_by_date[dt.year][dt.month][dt.day].append(row)
    except FileNotFoundError:
        pass

    return templates.TemplateResponse("completed_workouts.html", {
        "request": request,
        "workouts_by_date": workouts_by_date,
        "calendar": calendar  # so we can get month names in template
    })

@app.get("/completed_workout/{workout_date}")
def completed_workout(request: Request, workout_date: str):
    rows = []
    with open(COMPLETED_FILE, newline="") as f:
        reader = csv.DictReader(f)
        for row in reader:
            if row["date"] == workout_date:
                exercise_key = row["exercise"]
                category = EXERCISES.get(exercise_key, {}).get("category", "unknown")
                row["category"] = category
                rows.append(row)

    exercise_labels = {key: ex["label"] for key, ex in EXERCISES.items()}
    category_labels = {cat: cat.capitalize() for cat in set(ex["category"] for ex in EXERCISES.values())}

    return templates.TemplateResponse("view_completed_workout.html", {
        "request": request,
        "workout_date": workout_date,
        "rows": rows,
        "exercise_labels": exercise_labels,
        "category_labels": category_labels,
        "EXERCISES": EXERCISES,
    })
