import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  menuItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem'
  },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  isVeg: { type: Boolean, default: true }
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: {
    type: String,
    default: 'Customer'
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  restaurantName: {
    type: String,
    required: true
  },
  items: [orderItemSchema],
  deliveryAddress: {
    addressLine: { type: String, required: true },
    city: { type: String, default: 'New Delhi' },
    pincode: { type: String, default: '110001' },
    phone: { type: String, default: '9876543210' }
  },
  billDetails: {
    itemTotal: { type: Number, required: true },
    deliveryFee: { type: Number, default: 35 },
    platformFee: { type: Number, default: 5 },
    gstAndRestaurantCharges: { type: Number, default: 25 },
    discount: { type: Number, default: 0 },
    finalAmount: { type: Number, required: true }
  },
  paymentMethod: {
    type: String,
    enum: ['Cash on Delivery', 'Online (UPI / Card)'],
    default: 'Online (UPI / Card)'
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Completed', 'Failed'],
    default: 'Completed'
  },
  orderStatus: {
    type: String,
    enum: ['Order Placed', 'Kitchen Preparing', 'Rider On The Way', 'Delivered', 'Cancelled'],
    default: 'Order Placed'
  },
  riderDetails: {
    name: { type: String, default: 'Rahul Sharma' },
    phone: { type: String, default: '+91 98112 34567' },
    vehicleNo: { type: String, default: 'DL 04 AB 4321' }
  }
}, {
  timestamps: true
});

export default mongoose.models.Order || mongoose.model('Order', orderSchema);

