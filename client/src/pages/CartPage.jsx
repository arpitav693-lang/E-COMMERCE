import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  MapPin, 
  CreditCard, 
  Banknote, 
  Tag, 
  Check, 
  Plus, 
  Minus, 
  Trash2, 
  AlertCircle,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../services/api';

const CartPage = () => {
  const {
    cartItems,
    restaurant,
    itemTotal,
    deliveryFee,
    platformFee,
    gstAndRestaurantCharges,
    discount,
    finalTotal,
    appliedCoupon,
    addItem,
    removeItem,
    clearCart,
    applyCoupon,
    removeCoupon
  } = useCart();

  const { user, openLogin, addAddress } = useAuth();
  const navigate = useNavigate();

  // Address form
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [addressLine, setAddressLine] = useState('');
  const [city, setCity] = useState('New Delhi');
  const [pincode, setPincode] = useState('110001');

  // Coupon
  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState('');

  // Payment & Loading
  const [paymentMethod, setPaymentMethod] = useState('Online (UPI / Card)');
  const [loading, setLoading] = useState(false);
  const [orderError, setOrderError] = useState('');

  // Delivery instructions
  const [deliveryInstruction, setDeliveryInstruction] = useState('');

  if (cartItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="w-56 h-56 mx-auto mb-6 bg-orange-50 rounded-full flex items-center justify-center text-7xl shadow-inner">
          🛒
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 text-sm max-w-sm mx-auto mb-6 leading-relaxed">
          You can go to the home page to view more restaurants and explore delicious dishes.
        </p>
        <Link
          to="/"
          className="inline-flex items-center space-x-2 px-6 py-3.5 bg-swiggy-orange text-white rounded-xl font-bold uppercase text-xs tracking-wider hover:bg-swiggy-orangeHover transition-colors shadow-lg shadow-orange-500/20"
        >
          <span>See Restaurants Near You</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const handleApplyCoupon = (codeToApply) => {
    const code = codeToApply || couponInput;
    if (!code) return;
    const res = applyCoupon(code);
    setCouponMsg(res.message);
    if (res.success) {
      setCouponInput('');
    }
  };

  const handleSaveNewAddress = async (e) => {
    e.preventDefault();
    if (!addressLine) return;
    await addAddress({
      title: 'Delivery Address',
      addressLine,
      city,
      pincode,
      phone: user?.phone || '9876543210'
    });
    setShowNewAddressForm(false);
    setAddressLine('');
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      openLogin();
      return;
    }

    // Determine delivery address
    let currentAddress = null;
    if (user.addresses && user.addresses.length > 0) {
      currentAddress = user.addresses[selectedAddressIndex] || user.addresses[0];
    } else {
      currentAddress = {
        addressLine: addressLine || 'Flat 402, Connaught Place',
        city: city || 'New Delhi',
        pincode: pincode || '110001',
        phone: user.phone || '9876543210'
      };
    }

    setLoading(true);
    setOrderError('');

    try {
      const orderPayload = {
        restaurantId: restaurant._id,
        restaurantName: restaurant.name,
        items: cartItems,
        deliveryAddress: currentAddress,
        billDetails: {
          itemTotal,
          deliveryFee,
          platformFee,
          gstAndRestaurantCharges,
          discount,
          finalAmount: finalTotal
        },
        paymentMethod
      };

      const res = await orderAPI.create(orderPayload);
      clearCart();
      // Navigate directly to live tracking page!
      navigate(`/order/${res.data._id}`);
    } catch (err) {
      setOrderError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Account, Address, Payment (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Step 1: User Account */}
          <div className="bg-white p-6 rounded-3xl shadow-xs border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-gray-900 text-white text-xs flex items-center justify-center font-bold">
                    1
                  </span>
                  <span>Logged in as</span>
                </h3>
                {user ? (
                  <p className="text-sm font-semibold text-gray-700 mt-1 pl-8">
                    {user.name} | <span className="text-gray-500 font-normal">{user.email}</span>
                  </p>
                ) : (
                  <div className="mt-2 pl-8">
                    <p className="text-xs text-gray-500 mb-3">To place your order now, log in to your existing account or sign up.</p>
                    <button
                      onClick={openLogin}
                      className="px-5 py-2.5 bg-swiggy-orange text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-xs"
                    >
                      Sign In / Register
                    </button>
                  </div>
                )}
              </div>
              {user && (
                <div className="text-swiggy-green text-xs font-bold flex items-center gap-1 bg-green-50 px-2.5 py-1 rounded-full">
                  <Check className="w-3.5 h-3.5" />
                  <span>Verified</span>
                </div>
              )}
            </div>
          </div>

          {/* Step 2: Delivery Address */}
          <div className="bg-white p-6 rounded-3xl shadow-xs border border-gray-100">
            <h3 className="text-base font-extrabold text-gray-900 flex items-center gap-2 mb-4">
              <span className="w-6 h-6 rounded-full bg-gray-900 text-white text-xs flex items-center justify-center font-bold">
                2
              </span>
              <span>Delivery Address</span>
            </h3>

            {user?.addresses && user.addresses.length > 0 && !showNewAddressForm ? (
              <div className="pl-8 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {user.addresses.map((addr, idx) => (
                    <div
                      key={addr._id || idx}
                      onClick={() => setSelectedAddressIndex(idx)}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                        selectedAddressIndex === idx
                          ? 'border-swiggy-orange bg-orange-50/50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-extrabold uppercase text-gray-800 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-swiggy-orange" />
                          {addr.title || 'Address'}
                        </span>
                        {selectedAddressIndex === idx && (
                          <span className="w-2 h-2 rounded-full bg-swiggy-orange" />
                        )}
                      </div>
                      <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                        {addr.addressLine}, {addr.city} - {addr.pincode}
                      </p>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setShowNewAddressForm(true)}
                  className="mt-2 text-xs font-bold text-swiggy-orange hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Address</span>
                </button>
              </div>
            ) : (
              <form onSubmit={handleSaveNewAddress} className="pl-8 space-y-3">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">House / Flat / Block No.</label>
                  <input
                    type="text"
                    required
                    value={addressLine}
                    onChange={(e) => setAddressLine(e.target.value)}
                    placeholder="e.g. Flat 402, Royal Palms, Connaught Place"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Pincode</label>
                    <input
                      type="text"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-swiggy-black text-white rounded-xl text-xs font-bold"
                  >
                    Save & Use Address
                  </button>
                  {user?.addresses?.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowNewAddressForm(false)}
                      className="px-4 py-2 border rounded-xl text-xs font-bold text-gray-600"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>

          {/* Step 3: Payment Method */}
          <div className="bg-white p-6 rounded-3xl shadow-xs border border-gray-100">
            <h3 className="text-base font-extrabold text-gray-900 flex items-center gap-2 mb-4">
              <span className="w-6 h-6 rounded-full bg-gray-900 text-white text-xs flex items-center justify-center font-bold">
                3
              </span>
              <span>Payment Option</span>
            </h3>

            <div className="pl-8 space-y-3">
              {/* Online Payment */}
              <div
                onClick={() => setPaymentMethod('Online (UPI / Card)')}
                className={`p-4 rounded-2xl border-2 cursor-pointer flex items-center justify-between transition-all ${
                  paymentMethod === 'Online (UPI / Card)'
                    ? 'border-swiggy-green bg-green-50/40'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <CreditCard className="w-5 h-5 text-swiggy-green" />
                  <div>
                    <h4 className="font-bold text-sm text-gray-800">Online Payment (UPI / Cards / NetBanking)</h4>
                    <p className="text-xs text-gray-500">Instant simulated checkout without gateway hassle</p>
                  </div>
                </div>
                {paymentMethod === 'Online (UPI / Card)' && (
                  <Check className="w-5 h-5 text-swiggy-green stroke-[3]" />
                )}
              </div>

              {/* Cash on Delivery */}
              <div
                onClick={() => setPaymentMethod('Cash on Delivery')}
                className={`p-4 rounded-2xl border-2 cursor-pointer flex items-center justify-between transition-all ${
                  paymentMethod === 'Cash on Delivery'
                    ? 'border-swiggy-green bg-green-50/40'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Banknote className="w-5 h-5 text-gray-700" />
                  <div>
                    <h4 className="font-bold text-sm text-gray-800">Pay on Delivery (Cash / UPI)</h4>
                    <p className="text-xs text-gray-500">Pay with cash or QR code scan when food arrives</p>
                  </div>
                </div>
                {paymentMethod === 'Cash on Delivery' && (
                  <Check className="w-5 h-5 text-swiggy-green stroke-[3]" />
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Restaurant & Cart Bill (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            
            {/* Restaurant header in cart */}
            {restaurant && (
              <div className="flex items-center space-x-3 pb-4 border-b border-gray-100">
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <div>
                  <h4 className="font-bold text-gray-900 text-sm leading-snug">
                    {restaurant.name}
                  </h4>
                  <p className="text-xs text-gray-400">{restaurant.areaName}</p>
                </div>
              </div>
            )}

            {/* Item list */}
            <div className="py-4 space-y-3.5 max-h-72 overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div key={item._id} className="flex items-center justify-between text-xs sm:text-sm">
                  <div className="flex items-center space-x-2 truncate pr-2">
                    <span
                      className={`inline-block w-2.5 h-2.5 rounded-full shrink-0 ${
                        item.isVeg ? 'bg-green-600' : 'bg-red-600'
                      }`}
                    />
                    <span className="font-semibold text-gray-800 truncate">{item.name}</span>
                  </div>

                  {/* Counter & Price */}
                  <div className="flex items-center space-x-3 shrink-0">
                    <div className="flex items-center border border-gray-200 rounded-lg text-swiggy-green font-bold text-xs bg-white shadow-2xs">
                      <button
                        onClick={() => removeItem(item._id)}
                        className="p-1 hover:bg-gray-100"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-gray-800">{item.quantity}</span>
                      <button
                        onClick={() => addItem(item, restaurant)}
                        className="p-1 hover:bg-gray-100"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="font-bold text-gray-900 w-14 text-right">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Delivery Instructions */}
            <div className="py-3 border-t border-gray-100">
              <label className="block text-[11px] font-bold uppercase text-gray-500 mb-1.5">
                Delivery Instructions
              </label>
              <div className="flex gap-1.5 flex-wrap text-xs">
                {['Avoid calling', 'Leave with security', 'Don’t ring bell'].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setDeliveryInstruction(tag === deliveryInstruction ? '' : tag)}
                    className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition-colors ${
                      deliveryInstruction === tag
                        ? 'border-swiggy-orange bg-orange-50 text-swiggy-orange'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Apply Coupon */}
            <div className="py-4 border-t border-gray-100">
              <label className="block text-[11px] font-bold uppercase text-gray-500 mb-1.5">
                Apply Coupon Code
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="Try SWIGGY50 or WELCOME100"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-xl text-xs uppercase font-bold focus:outline-hidden focus:ring-1 focus:ring-swiggy-orange"
                />
                <button
                  type="button"
                  onClick={() => handleApplyCoupon()}
                  className="px-4 py-2 bg-gray-900 text-white text-xs font-bold rounded-xl hover:bg-black uppercase tracking-wider"
                >
                  Apply
                </button>
              </div>

              {/* Coupon Suggestions */}
              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => handleApplyCoupon('SWIGGY50')}
                  className="text-[10px] font-bold text-swiggy-orange bg-orange-50 px-2 py-1 rounded border border-orange-200 hover:bg-orange-100"
                >
                  🏷️ SWIGGY50 (Save ₹50)
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyCoupon('WELCOME100')}
                  className="text-[10px] font-bold text-swiggy-orange bg-orange-50 px-2 py-1 rounded border border-orange-200 hover:bg-orange-100"
                >
                  🏷️ WELCOME100 (Save ₹100)
                </button>
              </div>

              {couponMsg && (
                <p className="text-xs mt-1.5 font-bold text-green-700">{couponMsg}</p>
              )}

              {appliedCoupon && (
                <div className="mt-2 flex items-center justify-between bg-green-50 border border-green-200 p-2 rounded-xl text-xs">
                  <span className="font-bold text-green-800">'{appliedCoupon.code}' applied</span>
                  <button
                    onClick={removeCoupon}
                    className="text-red-600 font-bold hover:underline text-[10px]"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* Bill Details */}
            <div className="pt-4 border-t border-gray-100 space-y-2 text-xs text-gray-600">
              <h5 className="font-extrabold text-gray-900 uppercase text-[11px] tracking-wider mb-2">
                Bill Details
              </h5>

              <div className="flex justify-between">
                <span>Item Total</span>
                <span className="font-medium text-gray-900">₹{itemTotal}</span>
              </div>

              <div className="flex justify-between">
                <span>Delivery Fee | 2.5 kms</span>
                <span className="font-medium text-gray-900">
                  {deliveryFee === 0 ? <span className="text-green-600 font-bold">FREE</span> : `₹${deliveryFee}`}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Platform Fee</span>
                <span className="font-medium text-gray-900">₹{platformFee}</span>
              </div>

              <div className="flex justify-between">
                <span>GST and Restaurant Charges</span>
                <span className="font-medium text-gray-900">₹{gstAndRestaurantCharges}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-green-700 font-bold">
                  <span>Item Discount</span>
                  <span>- ₹{discount}</span>
                </div>
              )}

              <hr className="my-3 border-gray-200" />

              <div className="flex justify-between text-base font-black text-gray-900 pt-1">
                <span>TO PAY</span>
                <span className="text-lg text-swiggy-black">₹{finalTotal}</span>
              </div>
            </div>

            {orderError && (
              <div className="mt-4 p-3 bg-red-50 text-red-700 text-xs rounded-xl font-medium border border-red-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{orderError}</span>
              </div>
            )}

            {/* Place Order CTA Button */}
            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className="w-full mt-6 py-4 bg-swiggy-green text-white rounded-2xl font-black uppercase text-sm tracking-wider hover:bg-green-600 transition-all shadow-lg shadow-green-600/20 disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              <span>{loading ? 'Placing Order...' : `PAY ₹${finalTotal}`}</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>

            <div className="mt-4 flex items-center justify-center space-x-1 text-[11px] text-gray-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-gray-500" />
              <span>100% Safe and Secure Food Delivery Guarantee</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default CartPage;

