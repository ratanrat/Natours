const Tour = require('../models/tourmodel');

const catchAsync = require('./../utils/catchAsync');

// const APIFeatures = require('../utils/Apifeatures');

const AppError = require('./../utils/appError');

const factoryhandler = require('./allinonehandler'); //this handle all crud opration method 3 for all tout and as well as review
// RENDERING DTATA (FETCH DATA OR READ )

// exports.getalltour = async (req, res) => {
//   try {
//     // class object creating and use all filters

//     const features = new APIFeatures(Tour.find(), req.query)
//       .filter()
//       .sort()
//       .limitFields()
//       .paginate();

//     const datatour = await features.query;

//     res.status(200).json({
//       status: 'suscess',
//       result: datatour.length, // this is exceptionalgeting length of array this is convient top user
//       data: {
//         tours: datatour //here we can write  tours only if datatours is tours  same anme as api end point api/v1/tours
//       }
//     });
//   } catch (err) {
//     res.status(404).json({
//       status: 'fail',
//       message: err
//     });
//   }
// };

// // CREATE NEW TOUR (STORING IN DATABASE)
// exports.createtour = async (req, res) => {
//   //   method 1 to store data in db creating document
//   // const newTour = new Tour({});
//   // newTour.save();
//   try {
//     const newTour = await Tour.create(req.body);
//     if (req.body.rating > 5) {
//       res.status(404).json({
//         status: 'fail',
//         message: 'err'
//       });
//     }
//     res.status(201).json({
//       status: 'suscess',
//       data: {
//         tours: newTour
//       }
//     });
//   } catch (err) {
//     res.status(404).json({
//       status: 'fail',
//       message: err
//     });
//   }
// };

// // RENDERING DTATA BY ID (FETCH DATA OR READ )

// exports.gettouronid = async (req, res) => {
//   try {
//     const { id } = req.params; // ARRAY OR OBJECT IF WE HAVE TO EXTRACT VALUES THEN WE USE DESTRUCTRING
//     const datatour = await Tour.findById(id);

//     res.status(200).json({
//       status: 'sucess',

//       data: {
//         tours: datatour
//       }
//     });
//   } catch (err) {
//     res.status(404).json({
//       status: 'faileds',
//       message: err
//     });
//   }
// };

// // UPDATE DATA
// exports.updatetour = async (req, res) => {
//   try {
//     const { id } = req.params; // ARRAY OR OBJECT IF WE HAVE TO EXTRACT VALUES THEN WE USEDESTRUCTRING
//     const datatour = await Tour.findByIdAndUpdate(id, req.body, {
//       new: true,
//       runValidators: true
//     });

//     res.status(200).json({
//       status: 'sucess',

//       data: {
//         tours: datatour
//       }
//     });
//   } catch (err) {
//     res.status(404).json({
//       status: 'fail',
//       message: err
//     });
//   }
// };

// // delete DATA
// exports.deletetour = async (req, res) => {
//   try {
//     const { id } = req.params; // ARRAY OR OBJECT IF WE HAVE TO EXTRACT VALUES THEN WE USE DESTRUCTRING
//     const datatour = await Tour.findByIdAndDelete(id);

//     res.status(204).json({
//       status: 'sucess',

//       data: {
//         tours: datatour
//       }
//     });
//   } catch (err) {
//     res.status(404).json({
//       status: 'fail',
//       message: err
//     });
//   }
// };
// _______________________________METHOD RID OF TRY CATCH-----------------------------------------------

// exports.getalltour = catchAsync(async (req, res, next) => {
//   const features = new APIFeatures(Tour.find(), req.query)
//     .filter()
//     .sort()
//     .limitFields()
//     .paginate();
//   const tours = await features.query;

//   // SEND RESPONSE
//   res.status(200).json({
//     status: 'success',
//     results: tours.length,
//     data: {
//       tours
//     }
//   });
// });

// exports.gettouronid = catchAsync(async (req, res, next) => {
//   const tour = await Tour.findById(req.params.id).populate('reviews');
//   // Tour.findOne({ _id: req.params.id })

//   if (!tour) {
//     return next(new AppError('No tour found with that ID', 404));
//   }

//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour
//     }
//   });
// });

// exports.createtour = catchAsync(async (req, res, next) => {
//   const newTour = await Tour.create(req.body);

//   res.status(201).json({
//     status: 'success',
//     data: {
//       tour: newTour
//     }
//   });
// });

// exports.updatetour = catchAsync(async (req, res, next) => {
//   const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//     runValidators: true
//   });

//   if (!tour) {
//     return next(new AppError('No tour found with that ID', 404));
//   }

//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour
//     }
//   });
// });

// exports.deletetour = catchAsync(async (req, res, next) => {
//   const { id } = req.params;
//   const tour = await Tour.findByIdAndDelete(id);
//   console.log(id);
//   if (!tour) {
//     return next(new AppError('No tour found with that ID', 404));
//   }

//   res.status(204).json({
//     status: 'success',
//     data: null
//   });
// });

// _______________________________METHOD using allinone handler---------------------------------------------
exports.createtour = factoryhandler.createone(Tour);
exports.getalltour = factoryhandler.getall(Tour);
exports.gettouronid = factoryhandler.getone(Tour, {
  path: 'reviews',
  select: 'review user'
});
exports.deletetour = factoryhandler.deleteone(Tour);
exports.updatetour = factoryhandler.updateone(Tour);

// /tours-within/:distance/center/:latlng/unit/:unit
// /tours-within/233/center/34.111745,-118.113491/unit/mi
exports.getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitutr and longitude in the format lat,lng.',
        400
      )
    );
  }

  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
  });

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      data: tours
    }
  });
});

exports.getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitutr and longitude in the format lat,lng.',
        400
      )
    );
  }

  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1]
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier
      }
    },
    {
      $project: {
        distance: 1,
        name: 1
      }
    }
  ]);

  res.status(200).json({
    status: 'success',
    resut: distances.length,
    data: {
      data: distances
    }
  });
});
