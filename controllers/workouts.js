const Workouts = require("../models/Workout");
const bcrypt = require('bcrypt');
const auth = require('../auth');

const { errorHandler } = auth;

module.exports.workoutRoutine = (req, res)=>{
    const userId = req.user.id;

    const {exerciseName, duration} = req.body
    if(!exerciseName || !duration){
        return res.status(400).json({message: 'Please check your inputs'});
    }else{
        let newWorkouts = new Workouts({
            userId: userId,
            exerciseName: req.body.exerciseName,
            duration: req.body.duration
        })
        // newWorkouts.save()
        // .then((result)=> res.send(201).json({message: "New workout added"}))
        // .catch(error => errorHandler(error, req, res))
        newWorkouts.save()
        .then((result) => {
            res.status(201).json({ message: "New workout added" }); // Send JSON response here
        })
        .catch(error => errorHandler(error, req, res));
    }
}

module.exports.getWorkout = (req, res)=>{
    const userId = req.user.id;
    if(!req.user || !req.user.id){
        return res.status(404).send({message: "No User ID"});
    }
    
    return Workouts.find({userId})
    .then(result => {
        if (result) {
            // If the Cart is found, return the Cart.
            return res.status(200).send({ Workouts: result });
        } else {
            // If the Cart is not found, return 'Cart not found'.
            return res.status(404).send({ success: false, message: 'No Workouts , you lazy' });
        }
    })
.catch(error => errorHandler(error, req, res)); 
}

module.exports.updateWorkout = (req, res)=>{
    const exerciseId = req.params.exerciseId;

    let updatedWorkout={
        exerciseName: req.body.exerciseName,
        duration: req.body.duration
    }
    if(!updatedWorkout.exerciseName || !updatedWorkout.duration){
        return res.status(404).send("Please input your updates")
    }

    return Workouts.findByIdAndUpdate(exerciseId, updatedWorkout , {new: true})
        .then((updatedWorkout)=>{
            if(updatedWorkout){
            return res.status(200).json({message: "Workout updated successfully", updatedWorkout: updatedWorkout})
        }else {
            //if the Product is not found, return 'Product not found'.
            res.status(404).send({ message: 'Workout not found' });
        }
        })
        .catch(error => errorHandler(error, req, res));
}

module.exports.deleteWorkout= (req, res)=>{
    const exerciseId = req.params.exerciseId
    const userId = req.user.id;

    return Workouts.findByIdAndDelete(exerciseId)
    .then((result)=>{
        if(!result){
            return res.status(404).send({message: "Workout not found"})
        }

        if(result.userId !== userId){
            return res.status(401).send({message: "You are not the account owner/ Unauthorized"})
        }
        return res.status(201).send({message: "SUccessfully deleted"})
    })
    .catch(error => errorHandler(error, req, res))
}

module.exports.updateStatus = (req, res)=>{
    const ustatus = "Completed"
    let updateStatus={
        status: ustatus
    }
    return Workouts.findByIdAndUpdate(req.params.id , updateStatus, {new: true})
    .then((result)=>{
        if (!result) {
            return res.status(404).send({ message: "Workout not found" });
        }
        return res.status(201).send({message: "Successfully updated status", updatedWorkout: result})
    })
    .catch(error => errorHandler(error, req, res))

}
