const express = require('express');
const app = express();
const tourroutes = require('./routes/tourroutes');
const userroutes = require('./routes/userroutes');

// middleware for post
app.use(express.json());

// api calling
app.use('/api/v1/tours', tourroutes); // calling
app.use('/api/v1/users', userroutes); // calling user routes

// port
const port = 3000;
app.listen(port, () => {
  console.log(`app listenibg on port ${port}`);
});
