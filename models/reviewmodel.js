const mongose = require('mongoose');
const Tour = require('./tourmodel');

const reviewschema = new mongose.Schema(
  {
    review: {
      type: String,
      required: [true, 'review can not be empty']
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    cratedAt: {
      type: Date,
      default: Date.now()
    },
    tour: {
      type: mongose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'review must  belong to tour ']
    },
    user: {
      type: mongose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'review must belong to user']
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);
// reviewschema.index({ tour: 1, user: 1 });

reviewschema.index({ tour: 1, user: 1 }, { unique: true });

// multipule populate
// reviewschema.pre(/^find/, function(next) {
//   this.populate({
//     path: 'tour',
//     select: 'name'
//   }).populate({ path: 'user', select: 'name photo' });
//   next();
// });

// we did single for tour when we fetch we want only review populate only user
reviewschema.pre(/^find/, function(next) {
  this.populate({ path: 'user', select: 'name photo' });
  next();
});
// calculating averarge of rating and store it in tour model using statics method

reviewschema.statics.calculateaveragerating = async function(tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId }
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgrating: { $avg: '$rating' }
      }
    }
  ]);
  // console.log(stats);
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgrating
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5
    });
  }
};

// middeleawre to call function
// using post beacuse we want to call on it when review stored each  the time must be updated

reviewschema.post('save', function() {
  this.constructor.calculateaveragerating(this.tour); // and using this.constructor is used access of current tour and reason is we use post middleware
});

//we d0ont have any middleware for folwing this query
// findByIdAndUpdate
// findByIdAndDelete
// therfore for that we use query middle ware whenever findByIdAndUpdate findByIdAndDelete is fire
// fineoneand=findByIdAnd therefore this will exicute on evry findByIdAndUpdat findByIdAndDeletem query
reviewschema.pre(/^findOneAnd/, async function(next) {
  this.r = await this.findOne(); //this.r is used to store it on currentdocu so post middleware can get access the curent document beacuse post middleware exicute after query done
  // console.log(this.r);
  next();
});

reviewschema.post(/^findOneAnd/, async function() {
  // await this.findOne(); does NOT work here, query has already executed therfore we use this.r to get info about tour
  // constructor for apply on current
  await this.r.constructor.calculateaveragerating(this.r.tour);
});

const reviewdb = mongose.model('review', reviewschema);

module.exports = reviewdb;
