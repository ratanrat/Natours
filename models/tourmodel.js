const mongose = require('mongoose');

// schema for tours

const ToursSchema = new mongose.Schema({
  name: {
    type: String,
    required: [true, 'a tour name is required '],
    unique: true,
    trim: true
  },
  duration: {
    type: Number,
    required: [true, 'A tour must have a duration']
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have a group size']
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must have a difficulty']
    // enum: {
    //   values: ['easy', 'medium', 'difficult'],
    //   message: 'Difficulty is either: easy, medium, difficult'
    // }
  },
  ratingsAverage: {
    type: Number,
    default: 4.5
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  },
  priceDiscount: { type: Number },
  summary: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true,
    required: [true, 'A tour must have a description']
  },
  imageCover: {
    type: String,
    required: [true, 'A tour must have a cover image']
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  },
  startDates: [Date],
  secretTour: {
    type: Boolean,
    default: false
  },
  price: {
    type: Number,
    required: [true, 'a price name is required ']
  }
});

const Tour = mongose.model('Tour', ToursSchema);

module.exports = Tour;
