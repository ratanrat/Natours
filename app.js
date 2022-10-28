const fs = require('fs');
const express = require('express');
const app = express();
//middle ware for post

app.use(express.json());

const datatour = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

//http  get handler
const getalltour = (req, res) => {
  res.status(200).json({
    status: 'suscess',
    result: datatour.length, // this is exceptionalgeting length of array this is convient top user
    data: {
      tours: datatour, //here we can write  tours only if datatours is tours  same anme as api end point api/v1/tours
    },
  });
};

// post handler,post save request in on tours-simple.json file

const createtour = (req, res) => {
  //create id of coming req data  req
  const newId = datatour[datatour.length - 1].id + 1;

  // store all req datat and assign id to coming  data
  const newTour = Object.assign({ id: newId }, req.body);

  //push data this only save  on server i.e only in running
  datatour.push(newTour);

  // data store in json file this wil store on locally

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(datatour),
    (err) => {
      res.status(201).json({
        status: 'suscess',

        data: {
          tours: newTour,
        },
      });
    }
  );
};
//url responses
const gettouronid = (req, res) => {
  const id = req.params.id * 1;
  const tour = datatour.find((el) => el.id === id);

  if (id > datatour.length) {
    res.status(404).json({
      status: 'fail',
      message: 'invalid id',
    });
  }

  res.status(200).json({
    status: 'suscess',

    data: {
      tour,
    },
  });
};
//PATCH (UPDATE)
const updatetour = (req, res) => {
  const id = req.params.id * 1;
  const tour = datatour.find((el) => el.id === id);

  if (id > datatour.length) {
    res.status(404).json({
      status: 'fail',
      message: 'invalid id',
    });
  }

  res.status(200).json({
    status: 'suscess',
    message: '<UPDATE >',
  });
};
//  DELETEE
const deletetour = (req, res) => {
  const id = req.params.id * 1;
  const tour = datatour.find((el) => el.id === id);

  if (id > datatour.length) {
    res.status(404).json({
      status: 'fail',
      message: 'invalid id',
    });
  }

  res.status(204).json({
    status: 'suscess',
    data: null,
  });
};
// method 1

// app.get('/api/v1/tours', getalltour);

// app.post('/api/v1/tours', createtour);

// app.get('/api/v1/tours/:id', gettouronid);

// app.patch('/api/v1/tours/:id', updatetour);

// app.delete('/api/v1/tours/:id', deletetour);

// method 2
// sorting in sequence format api
app.route('/api/v1/tours').get(getalltour).post(createtour);
app
  .route('/api/v1/tours/:id')
  .get(gettouronid)
  .patch(updatetour)
  .delete(deletetour);

// port
const port = 3000;
app.listen(port, () => {
  console.log(`app listenibg on port ${port}`);
});
