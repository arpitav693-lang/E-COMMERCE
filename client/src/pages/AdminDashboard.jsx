import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Package, 
  Utensils, 
  PlusCircle, 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  MapPin,
  AlertCircle
} from 'lucide-react';
import { orderAPI, restaurantAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user, login } = useAuth();
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'addRestaurant' | 'addMenuItem'
  
  // Orders
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  // Restaurants for dropdown
  const [restaurants, setRestaurants] = useState([]);

  // New Restaurant Form
  const [restName, setRestName] = useState('');
  const [restCuisines, setRestCuisines] = useState('');
  const [restPrice, setRestPrice] = useState(300);
  const [restImage, setRestImage] = useState('');
  const [restArea, setRestArea] = useState('Connaught Place');
  const [restAddress, setRestAddress] = useState('Main Road');
  const [restDeliveryTime, setRestDeliveryTime] = useState('25-30 mins');
  const [restVegOnly, setRestVegOnly] = useState(false);
  const [restSuccess, setRestSuccess] = useState('');

  // New Menu Item Form
  const [selectedRestId, setSelectedRestId] = useState('');
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemCategory, setItemCategory] = useState('Recommended');
  const [itemDesc, setItemDesc] = useState('');
  const [itemImage, setItemImage] = useState('');
  const [itemIsVeg, setItemIsVeg] = useState(true);
  const [itemIsBestseller, setItemIsBestseller] = useState(false);
  const [menuSuccess, setMenuSuccess] = useState('');

  useEffect(() => {
    fetchOrders();
    fetchRestaurantsList();
  }, []);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await orderAPI.getAllAdmin();
      setOrders(res.data);
    } catch (err) {
      console.error('Failed to load admin orders', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchRestaurantsList = async () => {
    try {
      const res = await restaurantAPI.getAll();
      setRestaurants(res.data);
      if (res.data.length > 0) {
        setSelectedRestId(res.data[0]._id);
      }
    } catch (err) {}
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await orderAPI.updateStatus(orderId, newStatus);
      setStatusMsg(`Order ${orderId.slice(-6)} updated to ${newStatus}`);
      fetchOrders();
      setTimeout(() => setStatusMsg(''), 3000);
    } catch (err) {
      alert('Failed to update status: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleCreateRestaurant = async (e) => {
    e.preventDefault();
    try {
      await restaurantAPI.create({
        name: restName,
        cuisines: restCuisines.split(',').map(s => s.trim()),
        priceForTwo: restPrice,
        image: restImage || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
        areaName: restArea,
        address: restAddress,
        deliveryTime: restDeliveryTime,
        isVegOnly: restVegOnly
      });
      setRestSuccess(`Restaurant "${restName}" added successfully!`);
      setRestName('');
      setRestCuisines('');
      setRestImage('');
      fetchRestaurantsList();
      setTimeout(() => setRestSuccess(''), 3500);
    } catch (err) {
      alert('Failed to add restaurant: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleAddMenuItem = async (e) => {
    e.preventDefault();
    try {
      await restaurantAPI.addMenuItem({
        restaurantId: selectedRestId,
        name: itemName,
        price: Number(itemPrice),
        category: itemCategory,
        description: itemDesc,
        image: itemImage || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80',
        isVeg: itemIsVeg,
        isBestseller: itemIsBestseller
      });
      setMenuSuccess(`Dish "${itemName}" added successfully!`);
      setItemName('');
      setItemPrice('');
      setItemDesc('');
      setItemImage('');
      setTimeout(() => setMenuSuccess(''), 3500);
    } catch (err) {
      alert('Failed to add dish: ' + (err.response?.data?.message || err.message));
    }
  };

  const loginAsAdmin = async () => {
    try {
      await login('admin@swiggy.com', 'password123');
      fetchOrders();
    } catch (e) {}
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Swiggy Partner & Admin Portal</h1>
            <p className="text-xs text-gray-500">Live order fulfillment, menu editor, and restaurant onboarding</p>
          </div>
        </div>

        {/* Demo login helper if not logged in as admin */}
        {(!user || user.role !== 'admin') && (
          <button
            onClick={loginAsAdmin}
            className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-xs"
          >
            🛡️ Switch to Admin Account (1-Click)
          </button>
        )}
      </div>

      {statusMsg && (
        <div className="mb-6 p-3 bg-green-50 border border-green-200 text-green-700 text-xs font-bold rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-gray-200 mb-8 pb-2">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'orders'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>All Customer Orders ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('addRestaurant')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'addRestaurant'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Restaurant</span>
        </button>

        <button
          onClick={() => setActiveTab('addMenuItem')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'addMenuItem'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Utensils className="w-4 h-4" />
          <span>Add Menu Dish</span>
        </button>
      </div>

      {/* Tab Content: Orders */}
      {activeTab === 'orders' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-extrabold text-gray-800 text-base">Incoming & Active Orders</h3>
            <button
              onClick={fetchOrders}
              className="flex items-center space-x-1 text-xs font-bold text-indigo-600 hover:text-indigo-800"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingOrders ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>

          {orders.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-xs">
              <p className="text-gray-500 text-sm">No customer orders placed yet. Place an order from the front store to test fulfillment!</p>
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-xs border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-600">
                  <thead className="bg-gray-50 text-[11px] font-extrabold uppercase text-gray-400 border-b border-gray-100">
                    <tr>
                      <th className="p-4">Order ID & Date</th>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Restaurant</th>
                      <th className="p-4">Items</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4">Live Status</th>
                      <th className="p-4">Update Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {orders.map((ord) => (
                      <tr key={ord._id} className="hover:bg-gray-50/70">
                        <td className="p-4 font-bold text-gray-900">
                          <div>#{ord._id.slice(-6)}</div>
                          <div className="text-[10px] text-gray-400 font-normal">
                            {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="font-bold text-gray-900">{ord.userName}</div>
                          <div className="text-[10px] text-gray-400">{ord.deliveryAddress?.city}</div>
                        </td>
                        <td className="p-4 font-semibold text-gray-800">
                          {ord.restaurantName}
                        </td>
                        <td className="p-4 max-w-xs truncate">
                          {ord.items?.map(i => `${i.name} (${i.quantity})`).join(', ')}
                        </td>
                        <td className="p-4 font-black text-gray-900">
                          ₹{ord.billDetails?.finalAmount}
                        </td>
                        <td className="p-4">
                          <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                            ord.orderStatus === 'Delivered'
                              ? 'bg-green-100 text-green-700'
                              : ord.orderStatus === 'Rider On The Way'
                              ? 'bg-blue-100 text-blue-700'
                              : ord.orderStatus === 'Kitchen Preparing'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-orange-100 text-swiggy-orange'
                          }`}>
                            {ord.orderStatus}
                          </span>
                        </td>
                        <td className="p-4">
                          <select
                            value={ord.orderStatus}
                            onChange={(e) => handleStatusChange(ord._id, e.target.value)}
                            className="bg-white border border-gray-300 rounded-lg px-2.5 py-1 text-xs font-bold text-gray-700 focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                          >
                            <option value="Order Placed">Order Placed</option>
                            <option value="Kitchen Preparing">Kitchen Preparing</option>
                            <option value="Rider On The Way">Rider On The Way</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab Content: Add Restaurant */}
      {activeTab === 'addRestaurant' && (
        <div className="max-w-2xl bg-white p-8 rounded-3xl border border-gray-100 shadow-xs">
          <h3 className="text-lg font-black text-gray-900 mb-2">Onboard New Restaurant</h3>
          <p className="text-xs text-gray-500 mb-6">Enter restaurant details to make it available for online delivery.</p>

          {restSuccess && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 text-xs font-bold rounded-xl">
              {restSuccess}
            </div>
          )}

          <form onSubmit={handleCreateRestaurant} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1 uppercase">Restaurant Name</label>
              <input
                type="text"
                required
                value={restName}
                onChange={(e) => setRestName(e.target.value)}
                placeholder="e.g. Dosa Plaza"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1 uppercase">Cuisines (comma separated)</label>
              <input
                type="text"
                required
                value={restCuisines}
                onChange={(e) => setRestCuisines(e.target.value)}
                placeholder="e.g. South Indian, Dosas, Filter Coffee"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1 uppercase">Price for Two (₹)</label>
                <input
                  type="number"
                  required
                  value={restPrice}
                  onChange={(e) => setRestPrice(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1 uppercase">Delivery Time</label>
                <input
                  type="text"
                  value={restDeliveryTime}
                  onChange={(e) => setRestDeliveryTime(e.target.value)}
                  placeholder="20-25 mins"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1 uppercase">Area / Locality</label>
                <input
                  type="text"
                  value={restArea}
                  onChange={(e) => setRestArea(e.target.value)}
                  placeholder="e.g. Saket"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1 uppercase">Full Address</label>
                <input
                  type="text"
                  value={restAddress}
                  onChange={(e) => setRestAddress(e.target.value)}
                  placeholder="Market road, Saket"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1 uppercase">Cover Image URL</label>
              <input
                type="url"
                value={restImage}
                onChange={(e) => setRestImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm"
              />
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <input
                type="checkbox"
                id="vegOnly"
                checked={restVegOnly}
                onChange={(e) => setRestVegOnly(e.target.checked)}
                className="w-4 h-4 text-green-600 rounded"
              />
              <label htmlFor="vegOnly" className="text-xs font-bold text-gray-700 cursor-pointer">
                Pure Vegetarian Restaurant
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-indigo-600 text-white rounded-xl font-bold uppercase text-xs tracking-wider hover:bg-indigo-700 transition-colors shadow-md mt-4"
            >
              Add Restaurant
            </button>
          </form>
        </div>
      )}

      {/* Tab Content: Add Menu Item */}
      {activeTab === 'addMenuItem' && (
        <div className="max-w-2xl bg-white p-8 rounded-3xl border border-gray-100 shadow-xs">
          <h3 className="text-lg font-black text-gray-900 mb-2">Add Dish to Restaurant Menu</h3>
          <p className="text-xs text-gray-500 mb-6">Create appetizers, main courses, combos, and desserts.</p>

          {menuSuccess && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 text-xs font-bold rounded-xl">
              {menuSuccess}
            </div>
          )}

          <form onSubmit={handleAddMenuItem} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1 uppercase">Select Restaurant</label>
              <select
                value={selectedRestId}
                onChange={(e) => setSelectedRestId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold bg-white"
              >
                {restaurants.map((r) => (
                  <option key={r._id} value={r._id}>
                    {r.name} ({r.areaName})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1 uppercase">Dish Name</label>
              <input
                type="text"
                required
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="e.g. Masala Dosa with Sambhar"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1 uppercase">Price (₹)</label>
                <input
                  type="number"
                  required
                  value={itemPrice}
                  onChange={(e) => setItemPrice(e.target.value)}
                  placeholder="149"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1 uppercase">Category</label>
                <input
                  type="text"
                  required
                  value={itemCategory}
                  onChange={(e) => setItemCategory(e.target.value)}
                  placeholder="Recommended / Starters / Mains"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1 uppercase">Description</label>
              <textarea
                rows={2}
                value={itemDesc}
                onChange={(e) => setItemDesc(e.target.value)}
                placeholder="Ingredients, preparation details..."
                className="w-full px-4 py-2 rounded-xl border border-gray-300 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1 uppercase">Dish Image URL</label>
              <input
                type="url"
                value={itemImage}
                onChange={(e) => setItemImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm"
              />
            </div>

            <div className="flex items-center space-x-6 pt-2">
              <label className="flex items-center space-x-2 text-xs font-bold text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={itemIsVeg}
                  onChange={(e) => setItemIsVeg(e.target.checked)}
                  className="w-4 h-4 text-green-600 rounded"
                />
                <span>Vegetarian Dish</span>
              </label>

              <label className="flex items-center space-x-2 text-xs font-bold text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={itemIsBestseller}
                  onChange={(e) => setItemIsBestseller(e.target.checked)}
                  className="w-4 h-4 text-amber-500 rounded"
                />
                <span>★ Bestseller Tag</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-indigo-600 text-white rounded-xl font-bold uppercase text-xs tracking-wider hover:bg-indigo-700 transition-colors shadow-md mt-4"
            >
              Add Dish to Menu
            </button>
          </form>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;

