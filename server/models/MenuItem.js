import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema({
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    required: [true, 'Item price is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    default: 'Recommended'
  },
  image: {
    type: String,
    default: ''
  },
  isVeg: {
    type: Boolean,
    default: true
  },
  isBestseller: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    default: 4.3
  },
  ratingCount: {
    type: Number,
    default: 45
  },
  inStock: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.models.MenuItem || mongoose.model('MenuItem', menuItemSchema);

