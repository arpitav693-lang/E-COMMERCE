import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  Clock, 
  ChefHat, 
  Bike, 
  Home, 
  Phone, 
  Check, 
  ArrowLeft,
  Sparkles,
  MapPin
} from 'lucide-react';
import { orderAPI } from '../services/api';

const OrderTrackingPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentStatus, setCurrentStatus] = useState('Order Placed');

  const steps = [
    { title: 'Order Placed', desc: 'We have received your order', icon: CheckCircle2 },
    { title: 'Kitchen Preparing', desc: 'Restaurant is preparing fresh food', icon: ChefHat },
    { title: 'Rider On The Way', desc: 'Delivery partner has picked up order', icon: Bike },
    { title: 'Delivered', desc: 'Order safely delivered to your doorstep', icon: Home },
  ];

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const res = await orderAPI.getById(id);
      setOrder(res.data);
      setCurrentStatus(res.data.orderStatus || 'Order Placed');
    } catch (err) {
      console.error('Failed to fetch order', err);
    } finally {
      setLoading(false);
    }
  };

  const getStepIndex = (status) => {
    switch (status) {
      case 'Order Placed': return 0;
      case 'Kitchen Preparing': return 1;
      case 'Rider On The Way': return 2;
      case 'Delivered': return 3;
      default: return 0;
    }
  };

  const currentStepIndex = getStepIndex(currentStatus);

  // Fast-forward simulation helper for testing
  const advanceStatus = () => {
    const nextStatuses = ['Order Placed', 'Kitchen Preparing', 'Rider On The Way', 'Delivered'];
    const nextIdx = Math.min(nextStatuses.length - 1, currentStepIndex + 1);
    const next = nextStatuses[nextIdx];
    setCurrentStatus(next);
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4" />
        <div className="h-64 bg-gray-200 rounded-3xl w-full" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Not Found</h2>
        <Link to="/" className="text-swiggy-orange font-bold">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      
      {/* Back button & Title */}
      <div className="flex items-center justify-between mb-6">
        <Link
          to="/my-orders"
          className="flex items-center space-x-1.5 text-xs font-bold text-gray-600 hover:text-swiggy-orange transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>My Orders</span>
        </Link>
        <div className="text-xs text-gray-400 font-medium">
          Order ID: <span className="font-bold text-gray-700">{order._id}</span>
        </div>
      </div>

      {/* Main Status Hero Card */}
      <div className="bg-[#171A29] text-white rounded-3xl p-6 sm:p-8 mb-8 shadow-xl relative overflow-hidden">
        
        {/* Glow effect */}
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-swiggy-orange/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <span className="inline-flex items-center space-x-1.5 bg-swiggy-orange/20 text-swiggy-orange px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-swiggy-orange animate-ping" />
              <span>LIVE ORDER TRACKING</span>
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              {currentStatus === 'Delivered'
                ? 'Order Delivered!'
                : 'Arriving in 20-25 mins'}
            </h1>
            <p className="text-gray-400 text-xs sm:text-sm mt-1">
              {order.restaurantName} • Delivery to {order.deliveryAddress?.city || 'Delhi'}
            </p>
          </div>

          {/* Simulation fast-forward button */}
          {currentStepIndex < 3 && (
            <button
              onClick={advanceStatus}
              className="flex items-center space-x-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all border border-white/10"
              title="Click to simulate next delivery step"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Simulate Next Step</span>
            </button>
          )}
        </div>

        {/* 4-Step Tracker Progress */}
        <div className="relative mt-8">
          {/* Connecting line */}
          <div className="absolute top-5 left-6 right-6 h-1 bg-gray-700 -z-0 hidden sm:block">
            <div
              className="h-full bg-swiggy-orange transition-all duration-700"
              style={{ width: `${(currentStepIndex / 3) * 100}%` }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 relative z-10">
            {steps.map((step, idx) => {
              const isPassed = idx <= currentStepIndex;
              const isCurrent = idx === currentStepIndex;
              const Icon = step.icon;

              return (
                <div key={step.title} className="flex sm:flex-col items-center sm:text-center space-x-4 sm:space-x-0">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                      isCurrent
                        ? 'bg-swiggy-orange text-white ring-4 ring-orange-500/30 shadow-lg scale-110'
                        : isPassed
                        ? 'bg-swiggy-green text-white shadow-xs'
                        : 'bg-gray-800 text-gray-500'
                    }`}
                  >
                    {isPassed && !isCurrent ? (
                      <Check className="w-5 h-5 stroke-[3]" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>

                  <div className="sm:mt-3">
                    <p className={`text-xs font-bold ${isPassed ? 'text-white' : 'text-gray-500'}`}>
                      {step.title}
                    </p>
                    <p className="text-[11px] text-gray-400 leading-tight mt-0.5 hidden sm:block">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Rider details & Delivery address row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        
        {/* Rider Card */}
        <div className="bg-white rounded-3xl p-6 shadow-xs border border-gray-100 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center text-3xl">
              🛵
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                Delivery Partner
              </span>
              <h4 className="font-extrabold text-gray-900 text-base">
                {order.riderDetails?.name || 'Rahul Sharma'}
              </h4>
              <p className="text-xs text-gray-500">
                {order.riderDetails?.vehicleNo || 'DL 04 AB 4321'} • Vaccinated
              </p>
            </div>
          </div>

          <a
            href={`tel:${order.riderDetails?.phone || '+919811234567'}`}
            className="p-3 bg-green-50 text-green-700 hover:bg-green-100 rounded-2xl transition-colors"
            title="Call Delivery Partner"
          >
            <Phone className="w-5 h-5" />
          </a>
        </div>

        {/* Address Card */}
        <div className="bg-white rounded-3xl p-6 shadow-xs border border-gray-100 flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center text-swiggy-orange shrink-0">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
              Delivering To
            </span>
            <h4 className="font-extrabold text-gray-900 text-sm line-clamp-1">
              {order.deliveryAddress?.addressLine}
            </h4>
            <p className="text-xs text-gray-500">
              {order.deliveryAddress?.city} - {order.deliveryAddress?.pincode}
            </p>
          </div>
        </div>

      </div>

      {/* Order Items & Receipt */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-gray-100">
        <h3 className="text-lg font-black text-gray-900 mb-4">
          Order Summary
        </h3>

        <div className="divide-y divide-gray-100">
          {order.items?.map((item, idx) => (
            <div key={idx} className="py-3 flex justify-between items-center text-sm">
              <div className="flex items-center space-x-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    item.isVeg ? 'bg-green-600' : 'bg-red-600'
                  }`}
                />
                <span className="font-semibold text-gray-800">
                  {item.name} <span className="text-gray-400 font-normal">x {item.quantity}</span>
                </span>
              </div>
              <span className="font-bold text-gray-900">
                ₹{item.price * item.quantity}
              </span>
            </div>
          ))}
        </div>

        <hr className="my-4 border-gray-200" />

        <div className="space-y-2 text-xs text-gray-600">
          <div className="flex justify-between">
            <span>Item Total</span>
            <span className="font-medium text-gray-900">₹{order.billDetails?.itemTotal}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Fee</span>
            <span className="font-medium text-gray-900">₹{order.billDetails?.deliveryFee}</span>
          </div>
          <div className="flex justify-between">
            <span>Platform Fee</span>
            <span className="font-medium text-gray-900">₹{order.billDetails?.platformFee}</span>
          </div>
          <div className="flex justify-between">
            <span>Taxes & Charges</span>
            <span className="font-medium text-gray-900">₹{order.billDetails?.gstAndRestaurantCharges}</span>
          </div>
          {order.billDetails?.discount > 0 && (
            <div className="flex justify-between text-green-700 font-bold">
              <span>Coupon Discount</span>
              <span>- ₹{order.billDetails?.discount}</span>
            </div>
          )}

          <div className="flex justify-between text-base font-black text-gray-900 pt-2 border-t">
            <span>Total Paid</span>
            <span className="text-swiggy-green">₹{order.billDetails?.finalAmount}</span>
          </div>
          <p className="text-[11px] text-gray-400 text-right">
            Payment method: {order.paymentMethod}
          </p>
        </div>
      </div>

    </div>
  );
};

export default OrderTrackingPage;

