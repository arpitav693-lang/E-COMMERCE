import { Store } from '../services/store.js';
import { foodCategories } from '../data/seedData.js';

export const getRestaurants = async (req, res) => {
  try {
    const { isVegOnly, rating, search, sortBy } = req.query;
    const filter = {
      isVegOnly: isVegOnly === 'true',
      rating: rating ? Number(rating) : null,
      search: search || '',
      sortBy: sortBy || ''
    };

    const restaurants = await Store.getRestaurants(filter);
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRestaurantById = async (req, res) => {
  try {
    const { id } = req.params;
    const restaurant = await Store.getRestaurantById(id);

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const menuItems = await Store.getMenuItemsByRestaurant(id);

    // Group menu items by category
    const categoriesMap = {};
    menuItems.forEach((item) => {
      const cat = item.category || 'Recommended';
      if (!categoriesMap[cat]) categoriesMap[cat] = [];
      categoriesMap[cat].push(item);
    });

    res.json({
      restaurant,
      menuItems,
      categories: categoriesMap
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCategories = async (req, res) => {
  res.json(foodCategories);
};

export const createRestaurant = async (req, res) => {
  try {
    const { name, cuisines, priceForTwo, image, address, areaName, isVegOnly, deliveryTime } = req.body;
    if (!name || !cuisines || !priceForTwo) {
      return res.status(400).json({ message: 'Name, cuisines, and price are required' });
    }
    const newRestaurant = await Store.createRestaurant({
      name,
      cuisines: Array.isArray(cuisines) ? cuisines : cuisines.split(',').map(s => s.trim()),
      priceForTwo: Number(priceForTwo),
      image: image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80',
      address: address || 'Main Road',
      areaName: areaName || 'City Center',
      isVegOnly: isVegOnly === true || isVegOnly === 'true',
      deliveryTime: deliveryTime || '25-30 mins',
      rating: 4.2,
      ratingCount: '100+ ratings',
      isOpen: true
    });
    res.status(201).json(newRestaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addMenuItem = async (req, res) => {
  try {
    const { restaurantId, name, price, category, description, image, isVeg, isBestseller } = req.body;
    if (!restaurantId || !name || !price) {
      return res.status(400).json({ message: 'Restaurant ID, name, and price are required' });
    }
    const newItem = await Store.createMenuItem({
      restaurant: restaurantId,
      name,
      price: Number(price),
      category: category || 'Recommended',
      description: description || '',
      image: image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80',
      isVeg: isVeg === true || isVeg === 'true',
      isBestseller: isBestseller === true || isBestseller === 'true',
      rating: 4.3,
      ratingCount: 12
    });
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

