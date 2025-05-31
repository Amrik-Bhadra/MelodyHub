require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const cookieparser = require('cookie-parser');

// import routes
const authenRoutes = require('./routes/authentication.routes');
const coursesRoutes = require('./routes/courses.routes');
const lessonRoutes = require('./routes/lessons.routes.js')

// import database config file
const connectDB = require('./config/db');

// cors setup
var corsOption = {
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    methods: 'GET,PATCH,PUT,POST,HEAD,DELETE',
    credentials: true,
    AccessControlAllowOrigin: true,
    optionsSuccessStatus: 200
}

var port = process.env.PORT || 3000;

// middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors(corsOption));
app.use(cookieparser());

// connect to mongodb database
connectDB();

// routes
app.use('/api/auth', authenRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/lessons', lessonRoutes);


//listen to server
app.listen(port, ()=>{
    console.log(`App is listening to the port ${port} ✅`);
});