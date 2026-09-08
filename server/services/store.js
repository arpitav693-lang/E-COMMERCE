import Restaurant from '../models/Restaurant.js';
import MenuItem from '../models/MenuItem.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import { seedRestaurants, seedMenuItems } from '../data/seedData.js';
import { getDBStatus } from '../config/db.js';

// In-memory fallback stores
let memRestaurants = JSON.parse(JSON.stringify(seedRestaurants));
let memMenuItems = JSON.parse(JSON.stringify(seedMenuItems));
let memOrders = [];
let memUsers = [
  {
    _id: '66c000000000000000000001',
    name: 'Arpita Verma',
    email: 'user@swiggy.com',
    password: '$2a$10$X8aW4g4nF9bW5QWzQzHZeec997Z/9y3sW2oV2oQ0vK09g0w7d/5t2', // "password123"
    role: 'customer',
    phone: '+91 9876543210',
    addresses: [
      {
        _id: 'addr_1',
        title: 'Home',
        addressLine: 'Flat 402, Royal Palms, Connaught Place',
        city: 'New Delhi',
        pincode: '110001',
        isDefault: true
      }
    ]
  },
  {
    _id: '66c000000000000000000002',
    name: 'Admin Partner',
    email: 'admin@swiggy.com',
    password: '$2a$10$X8aW4g4nF9bW5QWzQzHZeec997Z/9y3sW2oV2oQ0vK09g0w7d/5t2', // "password123"
    role: 'admin',
    phone: '+91 9999999999',
    addresses: []
  }
];

export const syncSeedToMongo = async () => {
  if (!getDBStatus()) return;
  try {
    const rCount = await Restaurant.countDocuments();
    if (rCount === 0) {
      console.log('🔄 Seeding initial restaurants to MongoDB...');
      await Restaurant.insertMany(seedRestaurants);
      await MenuItem.insertMany(seedMenuItems);
      console.log('✅ MongoDB restaurants seeded successfully!');
    }
    const uCount = await User.countDocuments();
    if (uCount === 0) {
      console.log('🔄 Seeding initial demo users to MongoDB...');
      await User.insertMany(memUsers);
      console.log('✅ MongoDB demo users seeded successfully!');
    }
  } catch (err) {
    console.error('Error seeding to MongoDB:', err.message);
  }
};

export const Store = {
  // Restaurants
  async getRestaurants(filter = {}) {
    if (getDBStatus()) {
      try {
        let query = {};
        if (filter.isVegOnly) query.isVegOnly = true;
        if (filter.rating) query.rating = { $gte: Number(filter.rating) };
        if (filter.search) {
          query.$or = [
            { name: { $regex: filter.search, $options: 'i' } },
            { cuisines: { $regex: filter.search, $options: 'i' } }
          ];
        }
        let q = Restaurant.find(query);
        if (filter.sortBy === 'deliveryTime') q = q.sort({ deliveryTimeMin: 1 });
        if (filter.sortBy === 'rating') q = q.sort({ rating: -1 });
        if (filter.sortBy === 'priceAsc') q = q.sort({ priceForTwo: 1 });
        if (filter.sortBy === 'priceDesc') q = q.sort({ priceForTwo: -1 });
        return await q.exec();
      } catch (e) {
        console.warn('Mongo find error, fallback to memory:', e.message);
      }
    }

    // Memory filter
    let list = [...memRestaurants];
    if (filter.isVegOnly) list = list.filter(r => r.isVegOnly);
    if (filter.rating) list = list.filter(r => r.rating >= Number(filter.rating));
    if (filter.search) {
      const s = filter.search.toLowerCase();
      list = list.filter(r =>
        r.name.toLowerCase().includes(s) ||
        r.cuisines.some(c => c.toLowerCase().includes(s))
      );
    }
    if (filter.sortBy === 'deliveryTime') list.sort((a, b) => a.deliveryTimeMin - b.deliveryTimeMin);
    if (filter.sortBy === 'rating') list.sort((a, b) => b.rating - a.rating);
    if (filter.sortBy === 'priceAsc') list.sort((a, b) => a.priceForTwo - b.priceForTwo);
    if (filter.sortBy === 'priceDesc') list.sort((a, b) => b.priceForTwo - a.priceForTwo);
    return list;
  },

  async getRestaurantById(id) {
    if (getDBStatus()) {
      try {
        return await Restaurant.findById(id);
      } catch (e) {}
    }
    return memRestaurants.find(r => r._id.toString() === id.toString());
  },

  async createRestaurant(data) {
    if (getDBStatus()) {
      try {
        const rest = new Restaurant(data);
        return await rest.save();
      } catch (e) {}
    }
    const newRest = { ...data, _id: 'rest_' + Date.now() };
    memRestaurants.unshift(newRest);
    return newRest;
  },

  // Menu Items
  async getMenuItemsByRestaurant(restaurantId) {
    if (getDBStatus()) {
      try {
        return await MenuItem.find({ restaurant: restaurantId });
      } catch (e) {}
    }
    return memMenuItems.filter(item => item.restaurant.toString() === restaurantId.toString());
  },

  async createMenuItem(data) {
    if (getDBStatus()) {
      try {
        const item = new MenuItem(data);
        return await item.save();
      } catch (e) {}
    }
    const newItem = { ...data, _id: 'menu_' + Date.now() };
    memMenuItems.push(newItem);
    return newItem;
  },

  // Users
  async findUserByEmail(email) {
    if (getDBStatus()) {
      try {
        const u = await User.findOne({ email: email.toLowerCase() });
        if (u) return u;
      } catch (e) {}
    }
    return memUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
  },

  async findUserById(id) {
    if (getDBStatus()) {
      try {
        const u = await User.findById(id).select('-password');
        if (u) return u;
      } catch (e) {}
    }
    const u = memUsers.find(user => user._id.toString() === id.toString());
    if (u) {
      const { password, ...safeUser } = u;
      return safeUser;
    }
    return null;
  },

  async createUser(data) {
    if (getDBStatus()) {
      try {
        const u = new User(data);
        return await u.save();
      } catch (e) {}
    }
    const newUser = {
      ...data,
      _id: 'user_' + Date.now(),
      addresses: data.addresses || []
    };
    memUsers.push(newUser);
    return newUser;
  },

  async addAddress(userId, address) {
    if (getDBStatus()) {
      try {
        const user = await User.findById(userId);
        if (user) {
          user.addresses.push(address);
          return await user.save();
        }
      } catch (e) {}
    }
    const user = memUsers.find(u => u._id.toString() === userId.toString());
    if (user) {
      if (!user.addresses) user.addresses = [];
      const newAddr = { ...address, _id: 'addr_' + Date.now() };
      user.addresses.push(newAddr);
      return user;
    }
    return null;
  },

  // Orders
  async createOrder(orderData) {
    if (getDBStatus()) {
      try {
        const o = new Order(orderData);
        return await o.save();
      } catch (e) {}
    }
    const newOrder = {
      ...orderData,
      _id: 'order_' + Date.now(),
      createdAt: new Date().toISOString()
    };
    memOrders.unshift(newOrder);
    return newOrder;
  },

  async getUserOrders(userId) {
    if (getDBStatus()) {
      try {
        return await Order.find({ user: userId }).sort({ createdAt: -1 });
      } catch (e) {}
    }
    return memOrders.filter(o => o.user.toString() === userId.toString());
  },

  async getOrderById(orderId) {
    if (getDBStatus()) {
      try {
        return await Order.findById(orderId);
      } catch (e) {}
    }
    return memOrders.find(o => o._id.toString() === orderId.toString());
  },

  async getAllOrders() {
    if (getDBStatus()) {
      try {
        return await Order.find().sort({ createdAt: -1 });
      } catch (e) {}
    }
    return memOrders;
  },

  async updateOrderStatus(orderId, status) {
    if (getDBStatus()) {
      try {
        const o = await Order.findByIdAndUpdate(orderId, { orderStatus: status }, { new: true });
        if (o) return o;
      } catch (e) {}
    }
    const ord = memOrders.find(o => o._id.toString() === orderId.toString());
    if (ord) {
      ord.orderStatus = status;
      return ord;
    }
    return null;
  }
};
