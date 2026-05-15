/*--------------------------------
Creating a footer for website
--------------------------------- */

import React from "react";
import { Facebook, Github, Instagram, Linkedin, Twitter } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MiniFooter = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-12">
      <div className="container mx-auto px-4 py-8">

        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold text-white mb-2">
              Urban Attire
            </h3>
            <p className="text-sm text-gray-400">
              Discover quality products, best prices, and fast delivery.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li
                className="cursor-pointer hover:text-white"
                onClick={() => navigate("/shop/home")}
              >
                Home
              </li>
              <li
                className="cursor-pointer hover:text-white"
                onClick={() => navigate("/shop/listing")}
              >
                Shop
              </li>
              <li
                className="cursor-pointer hover:text-white"
                onClick={() => navigate("/shop/account")}
              >
                My Account
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold text-white mb-3">Follow Us</h4>
            <div className="flex gap-4">
                <Linkedin className="w-5 h-5 cursor-pointer hover:text-white" onClick={()=> navigate("https://www.linkedin.com/in/sushant-gaikwad-2670ba36a/")}/>
                <Github className="w-5 h-5 cursor-pointer hover:text-white" onClick={()=> navigate('https://github.com/Sushant01-web')}/>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 mt-6 pt-4 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} Urban Attire. All rights reserved - Sushant Gaikwad.
        </div>
      </div>
    </footer>
  );
};

export default MiniFooter;
