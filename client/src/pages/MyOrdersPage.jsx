import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ArrowRight, Clock, MapPin, CheckCircle2 } from 'lucide-react';
import { orderAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const MyOrdersPage = () => {
  const { user, openLogin } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const res = await orderAPI.getMyOrders();
      setOrders(res.data);
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">🔐</div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">Please login to view your orders</h2>
        <p className="text-gray-500 text-sm mb-6">Access your past orders and live tracking anytime.</p>
        <button
          onClick={openLogin}
          className="px-6 py-3 bg-swiggy-orange text-white rounded-xl font-bold uppercase text-xs tracking-wider shadow-md"
        >
          Sign In Now
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/4" />
        <div className="h-40 bg-gray-200 rounded-3xl" />
        <div className="h-40 bg-gray-200 rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center space-x-3 mb-8">
        <div className="w-10 h-10 rounded-2xl bg-orange-100 text-swiggy-orange flex items-center justify-center font-bold">
          <Package className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Past Orders</h1>
          <p className="text-xs text-gray-500">Track and view all orders placed with Swiggy</p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-xs">
          <div className="text-5xl mb-3">🍲</div>
          <h3 className="text-lg font-bold text-gray-800 mb-1">No orders yet</h3>
          <p className="text-gray-500 text-xs mb-6">Looks like you haven't experienced great food delivered hot yet.</p>
          <Link
            to="/"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-swiggy-orange text-white rounded-xl font-bold uppercase text-xs tracking-wider"
          >
            <span>Order Now</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const dateStr = new Date(order.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });

            return (
              <div
                key={order._id}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-xs hover:border-gray-200 transition-all"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-gray-100 gap-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-extrabold text-lg text-gray-900">
                        {order.restaurantName}
                      </h3>
                      <span className="text-xs bg-orange-50 text-swiggy-orange font-bold px-2 py-0.5 rounded-md">
                        {order.orderStatus}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{dateStr}</span>
                    </p>
                  </div>

                  <Link
                    to={`/order/${order._id}`}
                    className="flex items-center space-x-1.5 px-4 py-2 bg-swiggy-orange text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-swiggy-orangeHover transition-colors shadow-xs"
                  >
                    <span>Track Order</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {/* Items preview */}
                <div className="py-4">
                  <p className="text-xs text-gray-700 font-medium leading-relaxed">
                    {order.items?.map((item) => `${item.name} (${item.quantity})`).join(', ')}
                  </p>
                </div>

                {/* Bottom row */}
                <div className="flex justify-between items-center pt-2 text-xs font-semibold text-gray-600">
                  <span className="flex items-center gap-1 text-gray-400">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{order.deliveryAddress?.addressLine}</span>
                  </span>
                  <span className="text-sm font-black text-gray-900">
                    Total: ₹{order.billDetails?.finalAmount}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;

