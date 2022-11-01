const mongose = require('mongoose');

// schema for tours

const ToursSchema = new mongose.Schema({
  name: {
    type: String,
    required: [true, 'a tour name is required '],
    unique: true
  },
  rataing: {
    type: Number,
    default: 4.5
  },
  price: {
    type: Number,
    required: [true, 'a price name is required ']
  }
});

const Tour = mongose.model('Tour', ToursSchema);

module.exports = Tour;
