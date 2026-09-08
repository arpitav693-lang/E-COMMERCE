import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#02060C] text-gray-400 text-sm mt-20 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top App download banner */}
        <div className="bg-[#171A29] rounded-2xl p-8 mb-12 flex flex-col md:flex-row items-center justify-between text-white border border-gray-800">
          <div>
            <h3 className="text-2xl font-black mb-1">For better experience, download the Swiggy app now</h3>
            <p className="text-gray-400 text-sm">Order food, groceries, and more in minutes.</p>
          </div>
          <div className="flex space-x-4 mt-6 md:mt-0">
            <div className="bg-black/80 hover:bg-black px-4 py-2 rounded-xl flex items-center space-x-3 cursor-pointer border border-gray-700">
              <span className="text-2xl">🍏</span>
              <div>
                <div className="text-[10px] text-gray-400 uppercase leading-none">Download on the</div>
                <div className="text-sm font-bold text-white leading-tight">App Store</div>
              </div>
            </div>
            <div className="bg-black/80 hover:bg-black px-4 py-2 rounded-xl flex items-center space-x-3 cursor-pointer border border-gray-700">
              <span className="text-2xl">🤖</span>
              <div>
                <div className="text-[10px] text-gray-400 uppercase leading-none">Get it on</div>
                <div className="text-sm font-bold text-white leading-tight">Google Play</div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center space-x-2 text-white mb-4">
              <div className="w-8 h-8 rounded-xl bg-swiggy-orange flex items-center justify-center font-bold text-lg">
                S
              </div>
              <span className="text-xl font-black tracking-tight">SWIGGY</span>
            </div>
            <p className="text-xs text-gray-400 mb-4">
              © 2025 Swiggy MERN Clone Technologies Pvt. Ltd. Crafted with ❤️ for food lovers.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-xs">
              <li className="hover:text-white cursor-pointer">About Us</li>
              <li className="hover:text-white cursor-pointer">Swiggy Corporate</li>
              <li className="hover:text-white cursor-pointer">Careers</li>
              <li className="hover:text-white cursor-pointer">Team</li>
              <li className="hover:text-white cursor-pointer">Swiggy One</li>
              <li className="hover:text-white cursor-pointer">Swiggy Instamart</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Contact Us</h4>
            <ul className="space-y-2 text-xs">
              <li className="hover:text-white cursor-pointer">Help & Support</li>
              <li className="hover:text-white cursor-pointer">Partner with us</li>
              <li className="hover:text-white cursor-pointer">Ride with us</li>
              <li className="hover:text-white cursor-pointer">Terms & Conditions</li>
              <li className="hover:text-white cursor-pointer">Privacy Policy</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">We Deliver To:</h4>
            <ul className="space-y-2 text-xs">
              <li className="hover:text-white cursor-pointer">Delhi NCR</li>
              <li className="hover:text-white cursor-pointer">Bengaluru</li>
              <li className="hover:text-white cursor-pointer">Mumbai</li>
              <li className="hover:text-white cursor-pointer">Hyderabad</li>
              <li className="hover:text-white cursor-pointer">Pune</li>
              <li className="hover:text-white cursor-pointer">Kolkata & 500+ cities</li>
            </ul>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;

