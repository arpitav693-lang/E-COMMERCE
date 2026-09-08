import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Restaurant name is required'],
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  cuisines: {
    type: [String],
    required: true
  },
  rating: {
    type: Number,
    default: 4.2,
    min: 1,
    max: 5
  },
  ratingCount: {
    type: String,
    default: '500+ ratings'
  },
  deliveryTime: {
    type: String,
    default: '25-30 mins'
  },
  deliveryTimeMin: {
    type: Number,
    default: 30
  },
  priceForTwo: {
    type: Number,
    required: true,
    default: 300
  },
  image: {
    type: String,
    required: true
  },
  address: {
    type: String,
    default: 'Main Market'
  },
  areaName: {
    type: String,
    default: 'City Center'
  },
  isVegOnly: {
    type: Boolean,
    default: false
  },
  offer: {
    type: String,
    default: ''
  },
  isOpen: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.models.Restaurant || mongoose.model('Restaurant', restaurantSchema);

