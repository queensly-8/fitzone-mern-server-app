const express = require("express");
const workoutController = require("../controllers/workouts.js")
const auth = require("../auth.js");

const {verify, verifyAdmin} = auth;
const router = express.Router();

router.post("/addWorkout", verify, workoutController.workoutRoutine);
router.get("/getMyWorkout", verify, workoutController.getWorkout);
router.patch("/updateWorkout/:exerciseId", verify, workoutController.updateWorkout);
router.patch("/deleteWorkout/:exerciseId", verify, workoutController.deleteWorkout);
router.patch("/completeWorkoutStatus/:id", verify, workoutController.updateStatus);

module.exports = router;