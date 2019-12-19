// we will hook up to mongoose here.
const mongoose = require('mongoose');

//will resolve deprecated warnings
const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  });

  console.log(
    `MongoDB Connected: ${conn.connection.host}`.magenta.underline.bold
  );
};

module.exports = connectDB;
