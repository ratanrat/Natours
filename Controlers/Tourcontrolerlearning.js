const Tour = require('../models/tourmodel');

// RENDERING DTATA (FETCH DATA OR READ )

exports.getalltour = async (req, res) => {
  try {
    // SIMPLE WITHOUT FILTER

    // const datatour = await Tour.find(); //req.query gives parameter that we pass from url (query string)

    // 1) filtering serach method
    // const datatour = await Tour.find()
    //   .where('duration')
    //   .equals(5)
    //   .where('difficulty')
    //   .equals('easy');

    // 1a) filtering serach method

    // filtering serach method this beacuse some special methiod  page limit sort we want to remove it form url

    // create hard copy of req.query for tha we use structuring

    const objQuery = { ...req.query };

    const exclude = ['page', 'sort', 'limit', 'fields'];

    exclude.forEach(element => {
      delete objQuery[element];
    });
    // console.log(req.query, objQuery);

    // const query = Tour.find(objQuery);

    // const datatour = await query;

    // 2 )Modifying query advanced

    let Querystring = JSON.stringify(objQuery);
    Querystring = Querystring.replace(
      /\b(gte|gt|lte|lt)\b/g,
      match => `$${match}`
    );

    // console.log(JSON.parse(Querystring));// if we have to print object

    // const datatour = await query;

    // 2a)how to use sort method

    // let query = Tour.find(JSON.parse(Querystring));

    // if (req.query.sort) {
    // const sortBy = req.query.sort.split(',').join(' ');
    //   query = query.sort(sortBy);
    // } else {
    //   query = query.sort('-createdAt'); //by default we set
    // }
    // const datatour = await query;

    // 2b) how to use limit display specefic fileds
    let query = Tour.find(JSON.parse(Querystring));

    if (req.query.fields) {
      const filedsBy = req.query.fields.split(',').join(' ');

      query = query.select(filedsBy);
    } else {
      query = query.select('-description'); // by default
      // if we have to print object
    }

    //2c)pagination

    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 10;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    console.log(query);
    if (req.query.page) {
      const noofdocuments = await Tour.countDocuments();
      if (skip >= noofdocuments) throw new Error('limit stop');
    }
    const datatour = await query;

    res.status(200).json({
      status: 'suscess',
      result: datatour.length, // this is exceptionalgeting length of array this is convient top user
      data: {
        tours: datatour //here we can write  tours only if datatours is tours  same anme as api end point api/v1/tours
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

// CREATE NEW TOUR (STORING IN DATABASE)
exports.createtour = async (req, res) => {
  //   method 1 to store data in db creating document
  // const newTour = new Tour({});
  // newTour.save();
  try {
    const newTour = await Tour.create(req.body);
    if (req.body.rating > 5) {
      res.status(404).json({
        status: 'fail',
        message: 'err'
      });
    }
    res.status(201).json({
      status: 'suscess',
      data: {
        tours: newTour
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

// RENDERING DTATA BY ID (FETCH DATA OR READ )

exports.gettouronid = async (req, res) => {
  try {
    const { id } = req.params; // ARRAY OR OBJECT IF WE HAVE TO EXTRACT VALUES THEN WE USE DESTRUCTRING
    const datatour = await Tour.findById(id);

    res.status(200).json({
      status: 'sucess',

      data: {
        tours: datatour
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

// UPDATE DATA
exports.updatetour = async (req, res) => {
  try {
    const { id } = req.params; // ARRAY OR OBJECT IF WE HAVE TO EXTRACT VALUES THEN WE USEDESTRUCTRING
    const datatour = await Tour.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      status: 'sucess',

      data: {
        tours: datatour
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

// delete DATA
exports.deletetour = async (req, res) => {
  try {
    const { id } = req.params; // ARRAY OR OBJECT IF WE HAVE TO EXTRACT VALUES THEN WE USEDESTRUCTRING
    const datatour = await Tour.findByIdAndDelete(id);

    res.status(204).json({
      status: 'sucess',

      data: {
        tours: datatour
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};
//  <-----------------------------------practice locally wihout db ---------->
// const fs = require('fs');
// // convert json data into json object
// const datatour = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

// // tours
// //http  get handler
// exports.getalltour = (req, res) => {
//   res.status(200).json({
//     status: 'suscess',
//     result: datatour.length, // this is exceptionalgeting length of array this is convient top user
//     data: {
//       tours: datatour //here we can write  tours only if datatours is tours  same anme as api end point api/v1/tours
//     }
//   });
// };

// // post handler,post save request in on tours-simple.json file

// exports.createtour = (req, res) => {
//   //create id of coming req data  req
//   const newId = datatour[datatour.length - 1].id + 1;

//   // store all req datat and assign id to coming  data
//   const newTour = Object.assign({ id: newId }, req.body);

//   //push data this only save  on server i.e only in running
//   datatour.push(newTour);

//   // data store in json file this wil store on locally

//   fs.writeFile(
//     `${__dirname}/../dev-data/data/tours-simple.json`,
//     JSON.stringify(datatour),
//     err => {
//       res.status(201).json({
//         status: 'suscess',

//         data: {
//           tours: newTour
//         }
//       });
//     }
//   );
// };

// //url responses
// exports.gettouronid = (req, res) => {
//   const id = req.params.id * 1;
//   const tour = datatour.find(el => el.id === id);

//   if (id > datatour.length) {
//     res.status(404).json({
//       status: 'fail',
//       message: 'invalid id'
//     });
//   }

//   res.status(200).json({
//     status: 'suscess',

//     data: {
//       tour
//     }
//   });
// };
// //PATCH (UPDATE)
// exports.updatetour = (req, res) => {
//   const id = req.params.id * 1;
//   // const tour = datatour.find(el => el.id === id);

//   if (id > datatour.length) {
//     res.status(404).json({
//       status: 'fail',
//       message: 'invalid id'
//     });
//   }

//   res.status(200).json({
//     status: 'suscess',
//     message: '<UPDATE >'
//   });
// };
// //  DELETEE
// exports.deletetour = (req, res) => {
//   const id = req.params.id * 1;
//   // const tour = datatour.find(el => el.id === id);

//   if (id > datatour.length) {
//     res.status(404).json({
//       status: 'fail',
//       message: 'invalid id'
//     });
//   }

//   res.status(204).json({
//     status: 'suscess',
//     data: null
//   });
// };

// <---------------------------------------end of practice ------------------------------>
