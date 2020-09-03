const express=  require('express');
const app =  express();
const morgan =  require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');
const dotenv = require('dotenv');
// import routes
const  authRoutes = require('./routes/auth');
const  userRoutes = require('./routes/user');
const  categoryRoutes = require('./routes/category');
const  productRoutes = require('./routes/product');
// import mongoose
const mongoose = require('mongoose');
// load env variables

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
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressValidator());
//routes middleware
app.use("/api",authRoutes);
app.use("/api",userRoutes);
app.use("/api",categoryRoutes);
app.use("/api",productRoutes);

const port = process.env.PORT || 5000;

app.listen(port,() => {
    console.log(`Server is listening to port ${port}`);

});

