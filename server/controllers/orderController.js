import { Store } from '../services/store.js';

export const createOrder = async (req, res) => {
  try {
    const {
      restaurantId,
      restaurantName,
      items,
      deliveryAddress,
      billDetails,
      paymentMethod
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No order items specified' });
    }

    if (!deliveryAddress || !deliveryAddress.addressLine) {
      return res.status(400).json({ message: 'Delivery address is required' });
    }

    const newOrder = await Store.createOrder({
      user: req.user._id,
      userName: req.user.name,
      restaurant: restaurantId,
      restaurantName: restaurantName || 'Swiggy Restaurant',
      items: items.map(item => ({
        menuItem: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        isVeg: item.isVeg
      })),
      deliveryAddress,
      billDetails: billDetails || {
        itemTotal: items.reduce((acc, i) => acc + i.price * i.quantity, 0),
        deliveryFee: 35,
        platformFee: 5,
        gstAndRestaurantCharges: 25,
        discount: 0,
        finalAmount: items.reduce((acc, i) => acc + i.price * i.quantity, 0) + 65
      },
      paymentMethod: paymentMethod || 'Online (UPI / Card)',
      paymentStatus: paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Completed',
      orderStatus: 'Order Placed',
      riderDetails: {
        name: 'Rahul Sharma',
        phone: '+91 98112 34567',
        vehicleNo: 'DL 04 AB 4321'
      }
    });

    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const orders = await Store.getUserOrders(req.user._id);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Store.getOrderById(id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Store.getAllOrders();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['Order Placed', 'Kitchen Preparing', 'Rider On The Way', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: `Invalid status. Valid values: ${validStatuses.join(', ')}` });
    }

    const updated = await Store.updateOrderStatus(id, status);
    if (!updated) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

