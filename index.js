const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const User = require("./models/User.js")

//Routes
const userRoutes = require("./routes/user.js");
const workoutRoutes = require("./routes/workouts.js");

require('dotenv').config({path:'../.env'});

const app = express();


app.use(express.json());
app.use(express.urlencoded({extended:true}));


const corsOptions = {
	origin: ['http://localhost:8080', 'http://localhost:3000', 'https://fitzone-mern-client-app-kjzs.vercel.app'], // 
	credentials: true,
	optionsSuccessStatus: 200 
}

app.use(cors(corsOptions));


mongoose.connect(process.env.MONGODB_STRING, {
	// useNewURLParser: true,
	// useUnifiedTopology: true
});

//Mongoose connection
mongoose.connection.once('open', () => console.log('Now connected to MongoDB Atlas'));


// Backend Routes
app.use("/users", userRoutes);
app.use("/workout", workoutRoutes);



if(require.main === module){
	app.listen(process.env.PORT || 3000, () => {
		console.log(`API is now online at ${process.env.PORT || 3000}`)
	})
}


module.exports = {app, mongoose};