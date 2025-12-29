EXERCISES = {
    # Legs
    "squat": {
        "label": "Squat",
        "category": "legs",
        "weight_type": ["bodyweight", "dumbbell", "barbell"],
        "primary_muscles": ["quadriceps", "glutes"],
        "secondary_muscles": ["hamstrings", "calves"],
        "load_type": "weight"
    },
    "goblet_squat": {
        "label": "Goblet Squat",
        "category": "legs",
        "weight_type": ["dumbbell"],
        "primary_muscles": ["quadriceps", "glutes"],
        "secondary_muscles": ["hamstrings", "core"],
        "load_type": "weight"
    },
    "lunge": {
        "label": "Lunge",
        "category": "legs",
        "weight_type": ["bodyweight", "dumbbell"],
        "primary_muscles": ["quadriceps", "glutes"],
        "secondary_muscles": ["hamstrings"],
        "load_type": "weight"
    },
    "reverse_lunge": {
        "label": "Reverse Lunge",
        "category": "legs",
        "weight_type": ["bodyweight", "dumbbell"],
        "primary_muscles": ["quadriceps", "glutes"],
        "secondary_muscles": ["hamstrings"],
        "load_type": "weight"
    },
    "calf_raise": {
        "label": "Calf Raise",
        "category": "legs",
        "weight_type": ["bodyweight", "dumbbell"],
        "primary_muscles": ["calves"],
        "secondary_muscles": [],
        "load_type": "weight"
    },
    "clamshell": {
        "label": "Clamshell",
        "category": "legs",
        "weight_type": ["exercise_band", "bodyweight"],
        "primary_muscles": ["glutes"],
        "secondary_muscles": ["hips"],
        "load_type": "band_level"
    },

    # Arms
    "bicep_curl": {
        "label": "Bicep Curl",
        "category": "arms",
        "weight_type": ["dumbbell", "barbell"],
        "primary_muscles": ["biceps"],
        "secondary_muscles": [],
        "load_type": "weight"
    },
    "hammer_curl": {
        "label": "Hammer Curl",
        "category": "arms",
        "weight_type": ["dumbbell"],
        "primary_muscles": ["biceps", "brachialis"],
        "secondary_muscles": [],
        "load_type": "weight"
    },
    "tricep_extension": {
        "label": "Tricep Extension",
        "category": "arms",
        "weight_type": ["dumbbell", "exercise_band"],
        "primary_muscles": ["triceps"],
        "secondary_muscles": [],
        "load_type": "weight"  # band exercises will use band_level instead
    },
    "overhead_tricep_extension": {
        "label": "Overhead Tricep Extension",
        "category": "arms",
        "weight_type": ["dumbbell", "exercise_band"],
        "primary_muscles": ["triceps"],
        "secondary_muscles": [],
        "load_type": "weight"
    },
    "tricep_kickback": {
        "label": "Tricep Kickback",
        "category": "arms",
        "weight_type": ["dumbbell"],
        "primary_muscles": ["triceps"],
        "secondary_muscles": [],
        "load_type": "weight"
    },
    "push_up_close_grip": {
        "label": "Push-Up (Close Grip / Tricep Focus)",
        "category": "arms",
        "weight_type": ["bodyweight"],
        "primary_muscles": ["triceps"],
        "secondary_muscles": ["chest", "shoulders", "core"],
        "load_type": "none"
    },

    # Back
    "bent_over_dumbbell_row": {
        "label": "Bent-Over Dumbbell Row",
        "category": "back",
        "weight_type": ["dumbbell"],
        "primary_muscles": ["lats", "rhomboids"],
        "secondary_muscles": ["biceps", "rear_delts"],
        "load_type": "weight"
    },
    "single_arm_dumbbell_row": {
        "label": "Single-Arm Dumbbell Row",
        "category": "back",
        "weight_type": ["dumbbell"],
        "primary_muscles": ["lats", "rhomboids"],
        "secondary_muscles": ["biceps", "rear_delts"],
        "load_type": "weight"
    },
    "pull_up": {
        "label": "Pull-Up / Chin-Up",
        "category": "back",
        "weight_type": ["bodyweight"],
        "primary_muscles": ["lats"],
        "secondary_muscles": ["biceps", "traps"],
        "load_type": "none"
    },
    "renegade_row": {
        "label": "Renegade Row",
        "category": "back",
        "weight_type": ["dumbbell"],
        "primary_muscles": ["lats", "rhomboids"],
        "secondary_muscles": ["biceps", "core", "shoulders"],
        "load_type": "weight"
    },

    # Chest
    "bench_press": {
        "label": "Bench Press",
        "category": "chest",
        "weight_type": ["dumbbell", "barbell"],
        "primary_muscles": ["chest"],
        "secondary_muscles": ["triceps", "shoulders"],
        "load_type": "weight"
    },
    "dumbbell_fly": {
        "label": "Dumbbell Fly",
        "category": "chest",
        "weight_type": ["dumbbell"],
        "primary_muscles": ["chest"],
        "secondary_muscles": ["shoulders"],
        "load_type": "weight"
    },
    "push_up": {
        "label": "Push-Up",
        "category": "chest",
        "weight_type": ["bodyweight"],
        "primary_muscles": ["chest"],
        "secondary_muscles": ["triceps", "shoulders", "core"],
        "load_type": "none"
    },
    "incline_push_up": {
        "label": "Incline Push-Up",
        "category": "chest",
        "weight_type": ["bodyweight"],
        "primary_muscles": ["chest"],
        "secondary_muscles": ["triceps", "shoulders", "core"],
        "load_type": "none"
    },
    "decline_push_up": {
        "label": "Decline Push-Up",
        "category": "chest",
        "weight_type": ["bodyweight"],
        "primary_muscles": ["chest"],
        "secondary_muscles": ["triceps", "shoulders", "core"],
        "load_type": "none"
    },

    # Shoulders
    "shoulder_press": {
        "label": "Shoulder Press",
        "category": "shoulders",
        "weight_type": ["dumbbell", "barbell"],
        "primary_muscles": ["deltoids"],
        "secondary_muscles": ["traps", "triceps"],
        "load_type": "weight"
    },
    "lateral_raise": {
        "label": "Lateral Raise",
        "category": "shoulders",
        "weight_type": ["dumbbell", "exercise_band"],
        "primary_muscles": ["lateral_delts"],
        "secondary_muscles": [],
        "load_type": "weight"
    },
    "front_raise": {
        "label": "Front Raise",
        "category": "shoulders",
        "weight_type": ["dumbbell", "exercise_band"],
        "primary_muscles": ["front_delts"],
        "secondary_muscles": [],
        "load_type": "weight"
    },
    "rear_delt_fly": {
        "label": "Rear Delt Fly",
        "category": "shoulders",
        "weight_type": ["dumbbell", "exercise_band"],
        "primary_muscles": ["rear_delts"],
        "secondary_muscles": ["traps"],
        "load_type": "weight"
    },
    "arnold_press": {
        "label": "Arnold Press",
        "category": "shoulders",
        "weight_type": ["dumbbell"],
        "primary_muscles": ["deltoids"],
        "secondary_muscles": ["traps", "triceps"],
        "load_type": "weight"
    },

    # Core
    "plank": {
        "label": "Plank",
        "category": "core",
        "weight_type": ["bodyweight"],
        "primary_muscles": ["core"],
        "secondary_muscles": ["shoulders"],
        "load_type": "duration"
    },
    "side_plank": {
        "label": "Side Plank",
        "category": "core",
        "weight_type": ["bodyweight"],
        "primary_muscles": ["obliques"],
        "secondary_muscles": ["shoulders", "core"],
        "load_type": "duration"
    },
    "russian_twist": {
        "label": "Russian Twist",
        "category": "core",
        "weight_type": ["bodyweight", "dumbbell"],
        "primary_muscles": ["obliques"],
        "secondary_muscles": ["core"],
        "load_type": "weight"
    },
    "bicycle_crunch": {
        "label": "Bicycle Crunch",
        "category": "core",
        "weight_type": ["bodyweight"],
        "primary_muscles": ["abs", "obliques"],
        "secondary_muscles": [],
        "load_type": "none"
    },
    "leg_raise": {
        "label": "Leg Raise",
        "category": "core",
        "weight_type": ["bodyweight"],
        "primary_muscles": ["abs", "hip_flexors"],
        "secondary_muscles": [],
        "load_type": "none"
    },
    "mountain_climber": {
        "label": "Mountain Climber",
        "category": "core",
        "weight_type": ["bodyweight"],
        "primary_muscles": ["abs", "hip_flexors"],
        "secondary_muscles": ["shoulders"],
        "load_type": "none"
    },
    "dead_bug": {
        "label": "Dead Bug",
        "category": "core",
        "weight_type": ["bodyweight"],
        "primary_muscles": ["abs", "core"],
        "secondary_muscles": [],
        "load_type": "none"
    }
}
