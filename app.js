const express=  require('express');
const app =  express();
// import routes
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
//routes middleware
app.use(userRoutes);


const port = process.env.PORT || 3000;

app.listen(port,() => {
    console.log(`Server is listening to port ${port}`);

});

