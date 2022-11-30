const catchAsync = require('./../utils/catchAsync');
const APIFeatures = require('../utils/Apifeatures');
const AppError = require('./../utils/appError');

// create db operation for tour and review except user beacuse user need token
exports.createone = model =>
  catchAsync(async (req, res, next) => {
    const doc = await model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });

//   get all read all tour user review as weel as reviewon specific tour
exports.getall = model =>
  catchAsync(async (req, res, next) => {
    // filter use inreview for get review on specific tour
    let filter = {};
    if (req.params.toourID) filter = { tour: req.params.toourID };
    // api feature for tour
    const features = new APIFeatures(model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    // const doc = await features.query.explain();
    const doc = await features.query;

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: {
        doc
      }
    });
  });

// get one data on id for tour user except review
exports.getone = (model, popuoption) =>
  catchAsync(async (req, res, next) => {
    let querys = model.findById(req.params.id);
    if (popuoption) querys = model.findById(req.params.id).populate(popuoption);
    const doc = await querys;

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        doc
      }
    });
  });

exports.updateone = model =>
  catchAsync(async (req, res, next) => {
    const document = await model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!document) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        document
      }
    });
  });

//   for all
exports.deleteone = model =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const doc = await model.findByIdAndDelete(id);

    if (!doc) {
      return next(new AppError('No document found with this ID', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null
    });
  });
