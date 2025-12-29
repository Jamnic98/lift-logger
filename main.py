import os
from collections import defaultdict
from datetime import date
import calendar

from fastapi import FastAPI, Request, Form
from fastapi.responses import RedirectResponse
from fastapi.templating import Jinja2Templates
import csv
from typing import List

app = FastAPI()
templates = Jinja2Templates(directory="templates")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

TEMPLATES_FILE = os.path.join(BASE_DIR, "workout_templates.csv")
COMPLETED_FILE = os.path.join(BASE_DIR, "completed_sets.csv")

if not os.path.exists(TEMPLATES_FILE):
    with open(TEMPLATES_FILE, "w", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(["workout_name","category","exercise","weight_kg","reps","sets","rest_sec"])
else:
    # Ensure header is correct if file exists
    with open(TEMPLATES_FILE, "r", newline="") as f:
        reader = csv.reader(f)
        try:
            header = next(reader)
        except StopIteration:
            header = []

    if header != ["workout_name","category","exercise","weight_kg","reps","sets","rest_sec"]:
        # Rewrite file with correct header
        with open(TEMPLATES_FILE, "w", newline="") as f:
            writer = csv.writer(f)
            writer.writerow(["workout_name","category","exercise","weight_kg","reps","sets","rest_sec"])

EXERCISES = {
    # Legs
    "squat": {
        "label": "Squat",
        "category": "legs",
        "weight_type": ["bodyweight", "dumbbell", "barbell"],
        "primary_muscles": ["quadriceps", "glutes"],
        "secondary_muscles": ["hamstrings", "calves"]
    },
    "goblet_squat": {
        "label": "Goblet Squat",
        "category": "legs",
        "weight_type": ["dumbbell"],
        "primary_muscles": ["quadriceps", "glutes"],
        "secondary_muscles": ["hamstrings", "core"]
    },
    "lunge": {
        "label": "Lunge",
        "category": "legs",
        "weight_type": ["bodyweight", "dumbbell"],
        "primary_muscles": ["quadriceps", "glutes"],
        "secondary_muscles": ["hamstrings"]
    },
    "reverse_lunge": {
        "label": "Reverse Lunge",
        "category": "legs",
        "weight_type": ["bodyweight", "dumbbell"],
        "primary_muscles": ["quadriceps", "glutes"],
        "secondary_muscles": ["hamstrings"]
    },
    "calf_raise": {
        "label": "Calf Raise",
        "category": "legs",
        "weight_type": ["bodyweight", "dumbbell"],
        "primary_muscles": ["calves"],
        "secondary_muscles": []
    },
    "clamshell": {
        "label": "Clamshell",
        "category": "legs",
        "weight_type": ["exercise_band", "bodyweight"],
        "primary_muscles": ["glutes"],
        "secondary_muscles": ["hips"]
    },

    # Arms
    "bicep_curl": {
        "label": "Bicep Curl",
        "category": "arms",
        "weight_type": ["dumbbell"],
        "primary_muscles": ["biceps"],
        "secondary_muscles": []
    },
    "hammer_curl": {
        "label": "Hammer Curl",
        "category": "arms",
        "weight_type": ["dumbbell"],
        "primary_muscles": ["biceps", "brachialis"],
        "secondary_muscles": []
    },
    "tricep_extension": {
        "label": "Tricep Extension",
        "category": "arms",
        "weight_type": ["dumbbell", "exercise_band"],
        "primary_muscles": ["triceps"],
        "secondary_muscles": []
    },
    "overhead_tricep_extension": {
        "label": "Overhead Tricep Extension",
        "category": "arms",
        "weight_type": ["dumbbell", "exercise_band"],
        "primary_muscles": ["triceps"],
        "secondary_muscles": []
    },
    "tricep_kickback": {
        "label": "Tricep Kickback",
        "category": "arms",
        "weight_type": ["dumbbell"],
        "primary_muscles": ["triceps"],
        "secondary_muscles": []
    },
    "push_up_close_grip": {
        "label": "Push-Up (Close Grip / Tricep Focus)",
        "category": "arms",
        "weight_type": ["bodyweight"],
        "primary_muscles": ["triceps"],
        "secondary_muscles": ["chest", "shoulders", "core"]
    },

    # Back
    "bent_over_dumbbell_row": {
        "label": "Bent-Over Dumbbell Row",
        "category": "back",
        "weight_type": ["dumbbell"],
        "primary_muscles": ["lats", "rhomboids"],
        "secondary_muscles": ["biceps", "rear_delts"]
    },
    "single_arm_dumbbell_row": {
        "label": "Single-Arm Dumbbell Row",
        "category": "back",
        "weight_type": ["dumbbell"],
        "primary_muscles": ["lats", "rhomboids"],
        "secondary_muscles": ["biceps", "rear_delts"]
    },
    "pull_up": {
        "label": "Pull-Up / Chin-Up",
        "category": "back",
        "weight_type": ["bodyweight"],
        "primary_muscles": ["lats"],
        "secondary_muscles": ["biceps", "traps"]
    },
    "renegade_row": {
        "label": "Renegade Row",
        "category": "back",
        "weight_type": ["dumbbell"],
        "primary_muscles": ["lats", "rhomboids"],
        "secondary_muscles": ["biceps", "core", "shoulders"]
    },

    # Chest
    "bench_press": {
        "label": "Bench Press",
        "category": "chest",
        "weight_type": ["dumbbell", "barbell"],
        "primary_muscles": ["chest"],
        "secondary_muscles": ["triceps", "shoulders"]
    },
    "dumbbell_fly": {
        "label": "Dumbbell Fly",
        "category": "chest",
        "weight_type": ["dumbbell"],
        "primary_muscles": ["chest"],
        "secondary_muscles": ["shoulders"]
    },
    "push_up": {
        "label": "Push-Up",
        "category": "chest",
        "weight_type": ["bodyweight"],
        "primary_muscles": ["chest"],
        "secondary_muscles": ["triceps", "shoulders", "core"]
    },
    "incline_push_up": {
        "label": "Incline Push-Up",
        "category": "chest",
        "weight_type": ["bodyweight"],
        "primary_muscles": ["chest"],
        "secondary_muscles": ["triceps", "shoulders", "core"]
    },
    "decline_push_up": {
        "label": "Decline Push-Up",
        "category": "chest",
        "weight_type": ["bodyweight"],
        "primary_muscles": ["chest"],
        "secondary_muscles": ["triceps", "shoulders", "core"]
    },

    # Shoulders
    "shoulder_press": {
        "label": "Shoulder Press",
        "category": "shoulders",
        "weight_type": ["dumbbell", "barbell"],
        "primary_muscles": ["deltoids"],
        "secondary_muscles": ["traps", "triceps"]
    },
    "lateral_raise": {
        "label": "Lateral Raise",
        "category": "shoulders",
        "weight_type": ["dumbbell", "exercise_band"],
        "primary_muscles": ["lateral_delts"],
        "secondary_muscles": []
    },
    "front_raise": {
        "label": "Front Raise",
        "category": "shoulders",
        "weight_type": ["dumbbell", "exercise_band"],
        "primary_muscles": ["front_delts"],
        "secondary_muscles": []
    },
    "rear_delt_fly": {
        "label": "Rear Delt Fly",
        "category": "shoulders",
        "weight_type": ["dumbbell", "exercise_band"],
        "primary_muscles": ["rear_delts"],
        "secondary_muscles": ["traps"]
    },
    "arnold_press": {
        "label": "Arnold Press",
        "category": "shoulders",
        "weight_type": ["dumbbell"],
        "primary_muscles": ["deltoids"],
        "secondary_muscles": ["traps", "triceps"]
    },

    # Core
    "plank": {
        "label": "Plank",
        "category": "core",
        "weight_type": ["bodyweight"],
        "primary_muscles": ["core"],
        "secondary_muscles": ["shoulders"]
    },
    "side_plank": {
        "label": "Side Plank",
        "category": "core",
        "weight_type": ["bodyweight"],
        "primary_muscles": ["obliques"],
        "secondary_muscles": ["shoulders", "core"]
    },
    "russian_twist": {
        "label": "Russian Twist",
        "category": "core",
        "weight_type": ["bodyweight", "dumbbell"],
        "primary_muscles": ["obliques"],
        "secondary_muscles": ["core"]
    },
    "bicycle_crunch": {
        "label": "Bicycle Crunch",
        "category": "core",
        "weight_type": ["bodyweight"],
        "primary_muscles": ["abs", "obliques"],
        "secondary_muscles": []
    },
    "leg_raise": {
        "label": "Leg Raise",
        "category": "core",
        "weight_type": ["bodyweight"],
        "primary_muscles": ["abs", "hip_flexors"],
        "secondary_muscles": []
    },
    "mountain_climber": {
        "label": "Mountain Climber",
        "category": "core",
        "weight_type": ["bodyweight"],
        "primary_muscles": ["abs", "hip_flexors"],
        "secondary_muscles": ["shoulders"]
    },
    "dead_bug": {
        "label": "Dead Bug",
        "category": "core",
        "weight_type": ["bodyweight"],
        "primary_muscles": ["abs", "core"],
        "secondary_muscles": []
    }
}

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
    weight_kg: List[float] = Form(...),
    reps: List[int] = Form(...),
    sets: List[int] = Form(...),
    rest_sec: List[int] = Form(...)
):
    # Save template CSV
    with open(TEMPLATES_FILE, "a", newline="") as f:
        writer = csv.writer(f)
        for i in range(len(exercise)):
            writer.writerow([
                workout_name,
                category[i],
                exercise[i],
                weight_kg[i],
                reps[i],
                sets[i],
                rest_sec[i]
            ])

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
        "category_labels": CATEGORY_LABELS
    })


@app.post("/save_completed_workout/")
def save_completed_workout(
    workout_name: str = Form(...),
    exercise: List[str] = Form(...),
    weight_kg: List[float] = Form(...),
    reps: List[int] = Form(...),
    sets: List[int] = Form(...),
    rest_sec: List[int] = Form(...),
    rpe: List[str] = Form(...)
):
    rpe = [float(x) if x != "" else None for x in rpe]
    with open(COMPLETED_FILE, "a", newline="") as f:
        writer = csv.writer(f)
        for i in range(len(exercise)):
            writer.writerow([
                date.today().isoformat(),
                workout_name,
                exercise[i],
                weight_kg[i],
                reps[i],
                sets[i],
                rpe[i] if rpe[i] is not None else "",
                rest_sec[i]
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
    weight_kg: List[float] = Form(...),
    reps: List[int] = Form(...),
    sets: List[int] = Form(...),
    rest_sec: List[int] = Form(...)
):
    updated_rows = []

    # Load all existing templates
    with open(TEMPLATES_FILE, newline="") as f:
        reader = csv.DictReader(f)
        for row in reader:
            if row["workout_name"] != workout_name:
                updated_rows.append(row)

    # Add updated workout rows
    for i in range(len(exercise)):
        category = get_category_for_exercise(exercise[i])

        updated_rows.append({
            "workout_name": workout_name.strip(),
            "category": category,
            "exercise": exercise[i],
            "weight_kg": weight_kg[i],
            "reps": reps[i],
            "sets": sets[i],
            "rest_sec": rest_sec[i]
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
            "exercise_labels": EXERCISE_LABELS
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
        writer = csv.DictWriter(f, fieldnames=["workout_name", "category", "exercise", "weight_kg", "reps", "sets", "rest_sec"])
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

    return templates.TemplateResponse("completed_workout.html", {
        "request": request,
        "workout_date": workout_date,
        "rows": rows,
        "exercise_labels": exercise_labels,
        "category_labels": category_labels
    })
