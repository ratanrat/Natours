const mongose = require('mongoose');

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
const reviewdb = mongose.model('review', reviewschema);

module.exports = reviewdb;
