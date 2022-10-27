const fs = require('fs');
const express = require('express');
const app = express();
//middle ware for post

app.use(express.json());

// ROUTING demo

// appp.get('/', (req, res) => {
//   // res.end('hiii from server ');
//   res.json({ message: 'hiii from server ', app: 'natours' });
// });

const datatour = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

//http  get handler
app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'suscess',
    result: datatour.length, // this is exceptionalgeting length of array this is convient top user
    data: {
      tours: datatour, //here we can write  tours only if datatours is tours  same anme as api end point api/v1/tours
    },
  });
});

// post handler

// app.post('/api/v1/tours', (req, res) => {
//   console.log(req.body);
//   res.end('done');
// });

//post save request in on tours-simple.json file
app.post('/api/v1/tours', (req, res) => {
  //create id of coming req data  req
  const newId = datatour[datatour.length - 1].id + 1;

  // store all req datat and assign id to coming  data
  const newTour = Object.assign({ id: newId }, req.body);

  //push data
  datatour.push(newTour);

  // data store in json file

  // fs.writeFile(
  //   `${__dirname}/dev-data/data/tours-simple.json`,
  //   JSON.stringify(datatour),
  //   (err) => {
  res.status(201).json({
    status: 'suscess',

    data: {
      tour: newTour,
    },
  });
  //   }
  // );
});

// port
const port = 3000;
app.listen(port, () => {
  console.log(`app listenibg on port ${port}`);
});
