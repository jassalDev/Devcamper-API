const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const errorhandler = require('./middleware/error');
const logger = require('./middleware/logger');
const cookieParser = require('cookie-parser');
const fileupload  = require('express-fileupload');
const mongosaitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require('cors')
//route files 
const bootcamps = require('./routes/bootcamp');
const courses = require('./routes/courses');
const users = require('./routes/users');
const reviews = require('./routes/reviews');
const auth = require('./routes/auth');
const path = require('path')

const logicbootcamps = require('./controller/bootcamps');
const morgan = require('morgan')

// Dev logging middleware
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}


const app = express(); 

//Cookie parser
app.use(cookieParser());

// BODY parser
app.use(express.json());

//File uploading
app.use(fileupload());

//Sanitize Data
app.use(mongosaitize());

//Set Security Headers
app.use(helmet())

//Secure From xss Attacks
app.use(xss())

//Call From Differnt Domain 
app.use(cors());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

//Rate Limiter to Call API
app.use(limiter);

//Prevet hpp params from polution
app.use(hpp());

//Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

//Mount router
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use('/api/v1/reviews', reviews);


app.use(errorhandler);
app.use(logger);
//load ENV
dotenv.config({ path: './config/config.env'});

//coneect Db 
connectDB();


const PORT = process.env.PORT || 5000;
const server = app.listen(
    PORT, 
    console.log(`Server started on port ${process.env.NODE_ENV} mode on ${PORT}` .yellow.bold)
);

//Handle Promie Rejection
process.on('unhandledRejection', (err, Promise) => {
    console.log(`Error: ${err.message}` .red.bold);
    //server.close(() => process.exit(1));
});