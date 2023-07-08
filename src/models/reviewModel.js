const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Book'
  },
  reviewedBy: {
    type: String,
    default: 'Guest',
    required: true,
    trim: true
  },
  reviewedAt: {
    type: Date,
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  review: {
    type: String,
    trim: true 
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
});

module.exports  = mongoose.model('Review', reviewSchema);

