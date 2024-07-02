const User = require("../models/User.js");
const bcrypt = require("bcrypt");
const auth = require("../auth.js");

const { errorHandler } = auth;


module.exports.registerUser = (req, res) => {
        let newUser = new User({
            firstName : req.body.firstName,
            lastName : req.body.lastName,
            email : req.body.email,
            mobileNo : req.body.mobileNo,
            password : bcrypt.hashSync(req.body.password, 10)
        })

        newUser.save()
        .then((result) => res.status(201).send({message: "User registered successfully"}))
        .catch(error => errorHandler(error, req, res));
    } 

module.exports.loginUser = (req, res) => {
    if (!req.body.email.includes("@")) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

    User.findOne({ email: req.body.email })
        .then(result => {
            if (result == null) {
                return res.status(404).json({ message: 'No email found' });
            } else {
                const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password);
                if (isPasswordCorrect) {
                    return res.status(201).json({
                        message: 'User logged in successfully',
                        access: auth.createAccessToken(result)
                    });
                } else {
                    return res.status(401).json({ message: 'Incorrect email or password' });
                }
            }
        })
        .catch(err => res.status(500).json({ message: 'Internal server error', error: err }));
};


module.exports.getProfile = (req, res) => {
    // Validate if user ID is provided
    if (!req.user || !req.user.id) {
        return res.status(400).send('Invalid user ID');
    }

    return User.findById(req.user.id)
        .then(user => {
            if (!user) {
                // Send status 404 if user not found
                return res.status(404).send('User not found');
            }

            // Clear password before sending user object
            user.password = undefined;
            return res.status(200).send(user);
        })
        .catch(err => errorHandler(err, req, res));
};

module.exports.registerAdmin = (reqBody, isAdmin = true) =>{
    let newAdmin = new User({
        firstName: reqBody.firstName,
        lastName:reqBody.lastName,
        email: reqBody.email,
        mobileNo: reqBody.mobileNo,
        isAdmin: isAdmin,
        password: bcrypt.hashSync(reqBody.password, 10)
        
    })
    return newAdmin.save()
    .then((result) => result)
    .catch(err => err)

}

module.exports.updateUserRole = (req, res)=>{
    const userId = req.params.Id;

    let updatedUserRole = {
        isAdmin: true
    }
    return User.findByIdAndUpdate(userId, { isAdmin: true }, { new: true })
        .then((result) => {
            if (!result) {
                return res.status(404).send({ message: 'User not found' });
            }
            res.status(200).send({message: "User Updated as Admin Successfully"});
        })
};

module.exports.checkEmailExists = (req, res) => {
    if (req.body.email.includes("@")) {
        return User.find({ email : req.body.email })
        .then(result => {
            if (result.length > 0) {
                // If there is a duplicate email, send true with 409 http status back to the client
                return res.status(409).send(true)
            } else {
                // If there is no duplicate email, send false with 404 http status back to the client
                return res.status(404).send(false);
            };
        })
        .catch(err => errorHandler(err, req, res));
    }else{
        res.status(400).send(false)
    }
};




module.exports.getProfile = (req, res) => {
    // Validate if user ID is provided
    if (!req.user || !req.user.id) {
        return res.status(400).send('Invalid user ID');
    }

    return User.findById(req.user.id)
        .then(user => {
            if (!user) {
                // Send status 404 if user not found
                return res.status(404).send('User not found');
            }

            // Clear password before sending user object
            user.password = undefined;
            return res.status(200).send(user);
        })
        .catch(err => errorHandler(err, req, res));
};

module.exports.updateUserPassword = (req, res)=>{
    const userId = req.body.Id;
    const newPassword = req.body.newPassword;

    if(!newPassword){
        return res.status(404).send({message:'New password is required'});
    }
    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    return User.findByIdAndUpdate(userId, {password: hashedPassword}, {new:true})
        .then((result)=> {
            if(!result){
                return res.status(404).send({message: 'User not found'})
            }
            res.status(200).send({message:'Password updated successfully'});
        })
        .catch(err => errorHandler(err, req, res));
};


// [SECTION] Enroll a user to a course
module.exports.enroll = (req, res) => {

    console.log(req.user.id);
    console.log(req.body.enrolledCourses);


    if(req.user.isAdmin) {
        // Admins should not be allowed to enroll in a course
        return res.status(403).send('Admin is forbidden');
    }


    let newEnrollment = new Enrollment({
        userId: req.user.id, // ID of the logged-in user from the decoded token
        enrolledCourses: req.body.enrolledCourses, // Course IDs from the request body
        totalPrice: req.body.totalPrice // Total price from the request body
    });


    return newEnrollment.save()
        .then(enrolled => {
            return res.status(201).send({
                success: true,
                message: 'Enrolled successfully'
            });
        })
        .catch(err => errorHandler(err, req, res));
};



module.exports.getEnrollments = (req, res) => {
    // Validate if user ID is provided
    if (!req.user || !req.user.id) {
        return res.status(400).send('Invalid user ID');
    }

    return Enrollment.find({ userId: req.user.id })
        .then(enrollments => {
            if (enrollments.length > 0) {
                return res.status(200).send(enrollments);
            }
            return res.status(404).send('No user found');
        })
        .catch(err => errorHandler(err, req, res));
};