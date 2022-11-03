const Tour = require('../models/tourmodel');

const APIFeatures = require('./../utlis/Apifeatures');

// RENDERING DTATA (FETCH DATA OR READ )

exports.getalltour = async (req, res) => {
  try {
    // class object creating and use all filters

    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const datatour = await features.query;

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
