const express=  require('express');
const app =  express();
const morgan =  require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');
// import routes
const  authRoutes = require('./routes/auth');
const  userRoutes = require('./routes/user');
// import mongoose
const mongoose = require('mongoose');
// load env variables
const dotenv = require('dotenv');
dotenv.config()
 
//db connection
mongoose.connect(
  process.env.MONGO_URI,
  {useNewUrlParser: true,
   useUnifiedTopology: true ,
   useCreateIndex: true
  })
.then(() => console.log('DB Connected now'))
 
mongoose.connection.on('error', err => {
  console.log(`DB connection error: ${err.message}`)
});

// middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
//routes middleware
app.use("/api",authRoutes);
app.use("/api",userRoutes);


const port = process.env.PORT || 3000;

app.listen(port,() => {
    console.log(`Server is listening to port ${port}`);

});

