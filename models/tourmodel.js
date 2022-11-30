const mongose = require('mongoose');
const slugify = require('slugify');
// const validator = require('validator');

// schema for tours

const ToursSchema = new mongose.Schema(
  {
    name: {
      type: String,
      required: [true, 'a tour name is required '],
      unique: true,
      trim: true
      // validate: [validator.isAlpha, 'Tour name must only contain characters']
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
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, difficult'
      }
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
      required: [true, 'A tour must have a description'],
      select: false
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
    },
    startliocation: {
      type: {
        type: String,
        default: 'point', //we can give polygin or other geometric types but for start locationpoint
        enum: ['point']
      },
      cordinates: [Number],
      address: String,
      description: String
    },

    location: [
      {
        type: {
          type: String
        },
        cordinates: [Number],
        address: String,
        description: String,
        day: Number
      }
    ],
    guides: [
      {
        type: mongose.Schema.ObjectId,
        ref: 'User'
      }
    ],
    slug: String
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// for reading improve
ToursSchema.index({ price: 1 });

// document middle ware
ToursSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// query middleware

// Virtual populate
ToursSchema.virtual('reviews', {
  ref: 'review',
  select: 'review rating user',
  foreignField: 'tour',
  localField: '_id'
});

// for populate on all query start with find fetching refrence data

ToursSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'guides',
    select: '-changePasswordAt -__v'
  });
  next();
});

const Tour = mongose.model('Tour', ToursSchema);

module.exports = Tour;
